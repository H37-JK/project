import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth"
    }
})

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|login|register|auth|public).*)",
    ]
}