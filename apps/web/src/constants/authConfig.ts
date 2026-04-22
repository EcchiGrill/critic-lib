import { AuthOptions } from 'next-auth';
import { AxiosError } from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { User as UserType } from '@/types/user';
import { AuthService } from '@/api/authService';
import { sessionMaxAge } from './sessionMaxAge';

type AuthUser = Omit<UserType, 'updatedAt' | 'role' | 'isEmailConfirmed'> & {
  accessToken: string;
};

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }

  interface User extends AuthUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: AuthUser;
  }
}

const authService = new AuthService();

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        try {
          const res = await authService.login(
            credentials.identifier,
            credentials.password
          );
          const profile = await authService.getProfile(res.accessToken);

          return {
            id: profile.id,
            email: profile.email,
            favoriteBooks: profile.favoriteBooks,
            readBooks: profile.readBooks,
            reviews: profile.reviews,
            username: profile.username,
            avatar: profile.avatar,
            createdAt: profile.createdAt,
            accessToken: res.accessToken,
          };
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message);
          }
          throw new Error('An unexpected error occurred. Please try again.');
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        try {
          const res = await authService.googleOAuth({
            googleId: profile.sub!,
            email: profile.email!,
            name: profile.name!,
            picture: profile.image,
          });

          const userProfile = await authService.getProfile(res.accessToken);

          user.id = userProfile.id;
          user.email = userProfile.email;
          user.favoriteBooks = userProfile.favoriteBooks;
          user.readBooks = userProfile.readBooks;
          user.reviews = userProfile.reviews;
          user.username = userProfile.username;
          user.avatar = userProfile.avatar;
          user.createdAt = userProfile.createdAt;
          user.accessToken = res.accessToken;

          return true;
        } catch (error) {
          console.error('Google OAuth signIn callback error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = {
          ...user,
          id: user.id,
          email: user.email!,
        };
      }

      if (trigger === 'update' && token.user?.accessToken) {
        const updatedUser = await authService.getProfile(
          token.user.accessToken
        );

        if (updatedUser) {
          token.user = {
            accessToken: token.user.accessToken,
            id: updatedUser.id,
            username: updatedUser.username,
            avatar: updatedUser.avatar,
            createdAt: updatedUser.createdAt,
            email: updatedUser.email,
            favoriteBooks: updatedUser.favoriteBooks,
            readBooks: updatedUser.readBooks,
            reviews: updatedUser.reviews,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          ...token.user,
          id: token.user.id,
        };
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAge,
  },
};
