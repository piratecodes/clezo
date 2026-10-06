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
    '/refer-and-earn'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8, // Homepage gets highest priority
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
    dynamicRoutes.push({
      url: `${baseUrl}/${service.slug}`,
      lastModified: new Date(service.updatedAt || service.createdAt || new Date()).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority for service pages
    });
  });

  // 3. Fetch all Blogs dynamically
  let blogs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/blogs`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data.blogs) {
        // Only get published blogs
        blogs = data.data.blogs.filter(b => b.isPublished);
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

  // 4. Combine Static and Dynamic links and feed them to Google
  return [...staticRoutes, ...dynamicRoutes];
}