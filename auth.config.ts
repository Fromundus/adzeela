import { CredentialsSignin, NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import { login } from './app/api/authApi';
import { any } from 'zod';

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid identifier or password';
}

const authConfig = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID ?? '',
    //   clientSecret: process.env.GITHUB_SECRET ?? ''
    // }),
    CredentialProvider({
      credentials: {
        username: {
          type: 'username'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, res) {
        const user = await login(credentials);

        // const user = await login.data;

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user.data;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    AzureADB2CProvider({
      clientId: process.env.AZURE_AD_B2C_CLIENT,
      clientSecret: process.env.AZURE_AD_B2C_SECRET,
      issuer: process.env.AZURE_AD_B2C_ISSURE
    })
  ],
  pages: {
    signIn: '/' //sigin page,
    // error: '/test'
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        token.roles = user.roles;
        token.subscriptions = user.subscriptions;
        token.user_type = user.user_type;
        token.token = user.token;
        token.stripe_customer_id = user.stripe_customer_id;
        token.subscription_plan = user.subscription_plan;
      }

      return token;
    },
    async session({
      session,
      token,
      user
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      session.user.roles = token.roles;
      session.user.subscriptions = token.subscriptions;
      session.user.user_type = token.user_type;
      session.user.token = token.token;
      session.user.stripe_customer_id = token.stripe_customer_id;
      session.user.subscription_plan = token.subscription_plan;

      return session;
    }
    // async signIn({ user }: { user: any }) {
    //   // console.log('wtf man', user);
    //   if (user) {
    //     setToken(user.token);
    //     return true;
    //   }
    //   return false;
    // }
  },
  secret: process.env.NEXTAUTH_SECRET
} satisfies NextAuthConfig;

export default authConfig;
