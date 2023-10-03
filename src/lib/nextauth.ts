import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { prisma } from "./db";


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
       id:String;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id:string;
  }}


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
     jwt: async ([token]) => {
      const db_user = await prisma.user.findUnique({
        where: { email: token?.email },
      });
      if(db_user){
        token.id = db_user.id;
        token.name = db_user.name;

      }
return token;
    },
      session : ({ session, token }) => {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;

        }
      }
    }
  secret: process.env.NEXTAUTH_SCRET,
  adapter: PrismaAdapter(prisma),
};

