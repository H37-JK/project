import { useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function GoogleCallback() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        const { access_token, email, id } = router.query;

        if (access_token && email && id) {
            signIn("credentials", {
                redirect: false,
                isSocial: "true",
                accessToken: access_token,
                email: email,
                userId: id,
            }).then((result) => {
                if (result?.ok) {
                    router.push("/");
                } else {
                    router.push("/login?error=google_login_failed");
                }
            });
        } else if (router.isReady && !access_token) {
            router.push("/login");
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl">구글 로그인 처리 중입니다...</p>
        </div>
    );
}