import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                accessToken: { label: "AccessToken", type: "text"},
                isSocial: { label: "IsSocial", type: "text"},
                userId: { label: "UserId", type: "text"}
            },
            async authorize(credentials) {
                    if (credentials?.isSocial === 'true') {
                        return {
                            id: credentials.userId,
                            email: credentials.email,
                            accessToken: credentials.accessToken,
                            tokenType: "Bearer"
                        };
                    }


                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                    const formData = new URLSearchParams();
                    formData.append('username', credentials!.email);
                    formData.append('password', credentials!.password);

                    const res = await fetch(`${apiUrl}/login`, {
                        method: 'POST',
                        body: formData,
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }
                    });

                    const data = await res.json()
                    if (!res.ok) {
                        throw new Error(data.detail)
                    }

                    return {
                        id: String(data.id),
                        email: data.email,
                        accessToken: data.access_token,
                        tokenType: data.token_type
                    }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email
                token.accessToken = user.accessToken;
                token.tokenType = user.tokenType;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.accessToken = token.accessToken;
                session.user.tokenType = token.tokenType;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
});

