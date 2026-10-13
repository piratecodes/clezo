export default async function sitemap() {
  // Define your base URL (Change this to your actual production domain)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clezo.in';

  // 1. Define your Static Links
  const staticRoutes = [
    '', // This represents the Homepage '/'
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/blogs',
    '/services',
    '/offers',
    '/photo-gallery',
    '/refer-and-earn'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/offers' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : (route === '/offers' || route === '/services' ? 0.9 : 0.8), // Homepage and key commercial hubs get high priority
  }));

  const dynamicRoutes = [];

  // 2. Fetch all Service Categories dynamically
  let services = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/service-categories`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        // Backend returns data.data as the array of categories
        services = data.data;
      } else if (Array.isArray(data)) {
        services = data;
      }
    }
  } catch (error) {
    console.error("Sitemap Service Category Fetch Error:", error);
  }

  services.forEach((service) => {
    if (service.slug) {
      dynamicRoutes.push({
        url: `${baseUrl}/${service.slug}`,
        lastModified: new Date(service.updatedAt || service.createdAt || new Date()).toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9, // High priority for service pages
      });
    }
  });

  // 3. Fetch all Blogs dynamically
  let blogs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/blogs`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.blogs) {
        // Only get published, indexable blogs
        blogs = data.data.blogs.filter(b => b.isPublished && !b.seoIsNoIndex && b.slug);
      }
    }
  } catch (error) {
    console.error("Sitemap Blog Fetch Error:", error);
  }

  blogs.forEach((blog) => {
    dynamicRoutes.push({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8, 
    });
  });

  // 4. Fetch all Offers dynamically
  let offers = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/offers`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const data = await res.json();
      const rawOffers = data.data?.offers || (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
      // Only include active and indexable offers with a valid slug
      offers = rawOffers.filter(o => o.isActive !== false && !o.seoIsNoIndex && o.slug);
    }
  } catch (error) {
    console.error("Sitemap Offer Fetch Error:", error);
  }

  offers.forEach((offer) => {
    dynamicRoutes.push({
      url: `${baseUrl}/offers/${offer.slug}`,
      lastModified: new Date(offer.updatedAt || offer.createdAt || new Date()).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.85, 
    });
  });

  // 5. Combine Static and Dynamic links and feed them to Google
  return [...staticRoutes, ...dynamicRoutes];
}