import '@/styles/globals.css';
import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Work_Sans } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CriticLib',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className={`${workSans.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
