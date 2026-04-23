import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-preto text-white">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {children}
      </main>
    </div>
  );
}
