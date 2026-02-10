'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z.string().min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        if (result?.error && result.error !== 'undefined') {
            setError(result.error);
            setIsLoading(false);
        } else {
            window.location.href = '/'
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 w-full">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">관리자 로그인</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">이메일</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="admin@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">비밀번호</label>
                        <input
                            {...register('password')}
                            type="password"
                            className="w-full mt-1 p-2 border rounded-md"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}