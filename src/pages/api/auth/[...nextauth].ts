/* eslint-disable require-await */

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { refreshToken } from '@/api/requests/refreshToken';
import { SessionError } from '@/shared/typings/SessionError';
import { signInWithEmailCode } from '@/api/requests/signInWithEmailCode';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/welcome',
    signOut: '/',
    error: '/auth/error',
    newUser: '/',
    verifyRequest: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Email Code',
      id: 'email',
      credentials: {
        code: {
          label: 'Email Code',
          type: 'text',
        },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null;

        const response = await signInWithEmailCode(credentials.code);

        if (response.status === 401) {
          return null;
        }

        const authData = response.data;

        return { ...authData.user, backendTokens: authData.backendTokens };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) return { ...token, ...user, user };

      if (new Date().getTime() < token.backendTokens.expiresIn) return token;

      try {
        const response = await refreshToken(token);

        return {
          ...token,
          backendTokens: response.data,
        };
      } catch (err) {
        return {
          ...token,
          error: SessionError.RefreshAccessTokenError,
        };
      }
    },
    session: async ({ session, token }) => {
      session.user = token.user;
      session.backendTokens = token.backendTokens;
      session.error = token.error;

      return session;
    },
  },
};

export default NextAuth(authOptions);
