import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Riverwood Projects - Real Estate Platform',
  description: 'Find your dream property with AI-powered voice assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

