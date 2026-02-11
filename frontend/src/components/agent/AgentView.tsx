"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import {AgentStore} from "@/store/agent/AgentStore";

export default function AgentView() {
    const { data: session, status: sessionStatus } = useSession();
    const { isStarted, setIsStarted } = AgentStore()
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("연결 대기 중..");

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!isStarted || sessionStatus !== "authenticated" || !session?.user?.id) {
            console.log("⏳ 세션 로딩 중 또는 인증되지 않음...");
            return;
        }

        const socketUrl = `ws://localhost:8000/ws/view/${session.user.id}`;
        console.log("🔗 웹소켓 연결 시도:", socketUrl);

        const socket = new WebSocket(socketUrl);
        ws.current = socket;

        socket.onopen = () => {
            console.log("✅ 웹소켓 연결 성공");
            setStatus("실시간 중계 대기");
        };

        socket.onmessage = (event) => {
            if (event.data === "STREAM_END") {
                setStatus("🏁 작업 완료 (연결 종료됨)");
                setImageSrc('')
                setIsStarted(false)
                return;
            }
            setStatus("실시간 중계 중")
            setImageSrc("data:image/png;base64," + event.data);
        };

        socket.onerror = (error) => {
            console.error("❌ 웹소켓 에러:", error);
            setStatus("🔴 연결 에러 발생");
        };

        socket.onclose = (event) => {
            console.log("🔌 연결 끊김:", event.reason);
            setStatus((prev) =>
                prev !== "🏁 작업 완료 (연결 종료됨)" ? "⚪ 연결 종료됨" : prev
            );
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        };

    }, [session?.user?.id, sessionStatus, isStarted]);

    return (
        <div className="flex flex-col px-10 border-zinc-900 items-center gap-4 p-4 pt-0 border rounded-lg pb-15">
            <h2 className="text-xl font-bold">🖥️ 브라우저 실시간 화면</h2>

            <div className={`text-sm font-semibold ${
                status.includes("에러") ? "text-red-500" : status.includes("중계") ? "text-green-600" : "text-gray-500"
            }`}>
                {status}
            </div>

            {isStarted ? (
                <div className="relative w-[800px] h-auto border border-zinc-800 rounded overflow-hidden flex items-center justify-center">
                    {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={imageSrc}
                            alt="Browser Stream"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-gray-400">화면 대기 중...</div>
                    )}
                </div>
            ) : (
                <>
                </>
            )
            }
        </div>
    );
}