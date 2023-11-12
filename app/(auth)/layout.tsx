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
        <body
          className={`${inter.className} bg-dark-1 flex justify-center items-center h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
