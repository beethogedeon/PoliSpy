import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BarChart3, LineChart, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Canadian Political Media Analysis',
  description: 'Analysis of Canadian political media coverage and sentiment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    {
      title: 'Sentiment Analysis',
      href: '/sentiment-analysis',
      icon: LineChart,
    },
    {
      title: 'Coverage Analysis',
      href: '/coverage-analysis',
      icon: BarChart3,
    },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden bg-card border-b p-4">
            {/* Add logo image here*/}
            <Image
              src="/images/policy.tracker.png" // Path to your logo file
              alt="Logo"
              width={40} // Adjust the width as needed
              height={40} // Adjust the height as needed
              //className="rounded-full" // Optional: Add styling for the image
            />
          </header>

          {/* Sidebar */}
          <div className="w-full md:w-64 bg-card border-r">
            <div className="p-6 items-center">
            <Image
              src="/images/policy.tracker.png" // Path to your logo file
              alt="Logo"
              width={240} // Adjust the width as needed
              height={140} // Adjust the height as needed
              //className="rounded-full" // Optional: Add styling for the image
            />
              <nav className="flex md:flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm flex-1 md:flex-none justify-center md:justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}