import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import {  signIn } from "next-auth/react";

const LoginPage = () =>  {
    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login/google`;
    }

    return (
        <>
            <div className="background-gradient flex flex-1 justify-center items-center">
                <div className="flex flex-col space-y-4">
                    <button onClick={handleGoogleLogin} className="flex items-center cursor-pointer px-24 py-8 bg-white text-black rounded space-x-3 text-xl font-bold">
                        <FcGoogle className="mt-1"/>
                        <span>Sign in with Google</span>
                    </button>
                    <button onClick={() => signIn('github')} className="flex items-center px-24 py-8 bg-gray-800 cursor-pointer text-white rounded space-x-3 text-xl font-bold">
                        <FaGithubAlt className="mt-1"/>
                        <span>Sign in with GitHub</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default LoginPage;