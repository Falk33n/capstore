import { GeistSans } from 'geist/font/sans';
import type { ReactNode } from 'react';
import '~/styles/globals.scss';
import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from './_components/_index';

export const metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          {children} <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
