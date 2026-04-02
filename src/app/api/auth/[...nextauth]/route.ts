import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = ['liapustin@gmail.com'];
      const userEmail = user.email?.toLowerCase();
      
      console.log(`Checking access for email: ${userEmail}`);
      
      if (userEmail && allowedEmails.includes(userEmail)) {
        return true;
      }
      
      console.warn(`Access denied: ${userEmail} is not in whitelist`);
      return false; 
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
