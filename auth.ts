import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// You'll need to import and pass this
// to `NextAuth` in `pages/api/auth/[...nextauth].ts`
export const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const username = credentials?.username;
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        // 1. 查用户（用 username 登录）
        const user = await prisma.users.findUnique({
          where: {
            username,
          },
        });

        if (!user) {
          return null;
        }
        // 2. 检查状态
        if (user.status !== "active") {
          return null;
        }

        // 3. 校验密码
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
          return null;
        }

        // 4. 更新最后登录时间
        await prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            last_login_at: new Date(),
          },
        });

        // If no error and we have user data, return it
        if (user) {
          return {
            id: Number(user.id),
            username: user.username,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
      }
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.username = user.username;
        token.id = user.id as number;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      if (token && token?.accessToken) {
        session.accessToken = token.accessToken;
        session.user = {
          ...session.user,
          id: token.id,
          username: token.username,
        };
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;

    user: {
      id?: number;
      username?: string;
    };
  }

  interface User {
    id: number;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    username?: string;
    id?: number;
  }
}
