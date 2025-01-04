import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import { NextAuthOptions } from 'next-auth';
import { User } from '@/model/Users'; // Ensure you have this User type correctly defined in your model

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials?.identifier || !credentials.password) {
          throw new Error('Missing credentials');
        }

        await dbConnect();
        console.log('Credentials: ', credentials);

        try {
          // Look for a user by email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          console.log('User found:', user);

          if (!user) {
            throw new Error('No user found with this email or username');
          }

          // Check if the provided password matches the stored hashed password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Convert the Mongoose document to a plain object
            const plainUser: User = user.toObject();
            return plainUser; // Return the plain User object
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          console.error('Error: ', err);
          throw new Error(err.message); // Use err.message to capture the specific error message
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Attach user details to the JWT token
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Attach token data to the session object
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
