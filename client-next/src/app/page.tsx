"use client";

import React from 'react';
import UrlShortener from '@/components/UrlShortener';
import UrlList from '@/components/UrlList';

export default function Home() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleUrlCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <UrlShortener onUrlCreated={handleUrlCreated} />
      {/* Force re-render of list when new URL is created */}
      <div key={refreshKey}>
        <UrlList />
      </div>

      <footer className="text-center mt-20 text-slate-600 text-sm">
        <p>© 2025 SnapLink. Premium URL Shortener.</p>
        <p className="mt-1 text-slate-700">Designed with Next.js, Tailwind & Framer Motion</p>
      </footer>
    </div>
  );
}
