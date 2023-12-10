import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import '../globals.css';

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <section className="w-full min-h-screen flex flex-col justify-center items-center gap-8">
            <h1 className="head-text text-light-1">
              Welcome to Thread Clone App
            </h1>
            {children}
            <p className="!text-small-regular text-gray-1">
              Created and Licensed by M. Daffa Badran Thoriq | 2023
            </p>
          </section>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
