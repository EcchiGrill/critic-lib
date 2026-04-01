'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

export const SessionProvider = ({ children }: PropsWithChildren) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};
