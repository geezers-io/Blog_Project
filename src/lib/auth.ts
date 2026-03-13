import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      // 최초 로그인 시 Java 백엔드에 동기화하여 백엔드 userId와 JWT 획득
      if (account && user) {
        try {
          const apiUrl = process.env.API_URL || 'http://localhost:8080/api';
          const res = await fetch(`${apiUrl}/auth/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email || '',
              name: user.name || '',
              image: user.image || '',
            }),
          });
          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.token;
            token.backendUserId = data.user.id;
          }
        } catch (e) {
          console.error('Backend sync failed:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.backendUserId as string;
        (session.user as any).backendToken = token.backendToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
