import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User as UserType } from '@/types/user';
import { AuthService } from '@/api/authService';
import { sessionMaxAge } from './sessionMaxAge';

type AuthUser = Omit<UserType, 'updatedAt'> & { accessToken: string };

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
      },
    }),
  ],

  callbacks: {
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
