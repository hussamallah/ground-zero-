'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Analytics() {
  useEffect(() => {
    const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!analyticsEnabled || !gaId) {
      return;
    }

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.gtag = function() {
      (window.gtag as any).q = (window.gtag as any).q || [];
      (window.gtag as any).q.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track page views on route changes
    const handleRouteChange = () => {
      if (window.gtag) {
        window.gtag('config', gaId, {
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    };

    // Listen for route changes (Next.js 13+ app router)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
}
