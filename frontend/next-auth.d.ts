import NextAuth, {DefaultSession} from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string
        email: string
        accessToken: string
        tokenType: string
    }

    interface Session {
        user: {
            id?: string
            email?: string
            accessToken?: string
            tokenType?: string
        } & DefaultSession["user"] & User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        email: string
        accessToken: string
        tokenType: string
    }
}