// Root layout component
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Music from Poetry - AI-Powered Music Generation',
  description: 'Transform your poems and lyrics into beautiful instrumental music using AI',
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