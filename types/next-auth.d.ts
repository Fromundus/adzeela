import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    token: string;
  }

  interface CustomSession extends DefaultSession {
    user: {
      email: string;
      name: string;
      roles: Array<any> | [];
      token: string;
    };
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }

  interface User {
    stripe_customer_id: string;
    subscription_plan: string;
    name: string;
    email: string;
    user_type: string;
    roles: string[],
    subscriptions: string[],
  }
}
