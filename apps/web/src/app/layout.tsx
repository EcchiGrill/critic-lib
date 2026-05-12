import '@/styles/globals.css';
import { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Work_Sans } from 'next/font/google';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SessionProvider } from '@/providers/SessionProvider';
import { ToastContainer } from 'react-toastify';

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
        <SessionProvider>
          <ThemeProvider>
            {children}
            <ToastContainer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
