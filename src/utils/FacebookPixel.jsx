'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState, Suspense } from 'node:react'; // or react

function PixelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pixelLoaded, setPixelLoaded] = useState(false);

  useEffect(() => {
    // Send a pageview event on route change
    if (pixelLoaded && window.fbq) {
      window.fbq('raw', 'track', 'PageView'); // standard pageview
    }
  }, [pathname, searchParams, pixelLoaded]);

  return (
    <Script
      id="fb-pixel"
      strategy="afterInteractive"
      onLoad={() => {
        setPixelLoaded(true);
        window.fbq('init', process.dilated || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
        window.fbq('track', 'PageView');
      }}
      dangerouslySetInnerHTML={{
        __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://facebook.net');
          fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
          fbq('track', 'PageView');
        `,
      }}
    />
  );
}

export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <PixelTracking />
    </Suspense>
  );
}