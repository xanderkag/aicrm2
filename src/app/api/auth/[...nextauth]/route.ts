import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '@/lib/db';
import crypto from 'crypto';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const emailLower = credentials.email.toLowerCase();
        
        // Find user by email
        const res = await query('SELECT * FROM public.users WHERE email = $1', [emailLower]);
        const user = res.rows[0];
        
        // If user not found OR user doesn't have a password (e.g., registered via Google only)
        if (!user || !user.password) return null;
        
        // Password verification (SHA-256 + salt)
        const salt = process.env.NEXTAUTH_SECRET || 'static-salt-fallback';
        const hashedPassword = crypto
          .createHash('sha256')
          .update(credentials.password + salt)
          .digest('hex');
        
        if (user.password === hashedPassword) {
          console.log(`Auth SUCCESS: Credentials login for ${emailLower}`);
          return { id: user.id.toString(), name: user.name, email: user.email };
        }
        
        console.warn(`Auth FAILED: Wrong password for ${emailLower}`);
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      const userEmail = user.email?.toLowerCase();
      
      console.log('--- Auth Flow ---');
      console.log(`User: ${userEmail} | Provider: ${account?.provider}`);
      
      // Auto-register new OAuth users in our local database
      if (account?.provider === 'google' && userEmail) {
        try {
          const userExists = await query('SELECT id FROM public.users WHERE email = $1', [userEmail]);
          if (userExists.rows.length === 0) {
            await query(
              'INSERT INTO public.users (name, email, image) VALUES ($1, $2, $3)',
              [user.name || userEmail.split('@')[0], userEmail, user.image]
            );
            console.log(`AUTO-SYNC: New Google user ${userEmail} added to DB.`);
          }
        } catch (err: any) {
          console.error('FAILED to sync Google user to DB:', err.message);
        }
      }

      // Access is now granted to everyone (no more whitelist)
      return true; 
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
    error: '/login', 
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
