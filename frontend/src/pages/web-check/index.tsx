import React from "react";
import WebAnalyzeComponent from "@/components/web-analyze/WebAnalyzeComponent";
import {useWebAnalyzeDataHooks} from "@/hooks/web-analyze/data/useWebAnalyzeDataHooks";
import {useWebAnalyzeUIHooks} from "@/hooks/web-analyze/ui/useWebAnalyzeUIHooks";
import {useUIHooks} from "@/hooks/common/ui/useUIHooks";


export default function Home() {
    const {
        id,
        setId,
        progress,
        isAnalyzing,
        domain,
        setDomain,
        errorMessage,
        webCheck,
        isShowAlert,
        createWebAnalyzeRequest
    } = useWebAnalyzeDataHooks()


    useUIHooks({
        onCallRequest: createWebAnalyzeRequest,
        canSend: !!domain
    });
    return (
        <div className="flex flex-col flex-1 relative">


            {!domain || !webCheck ? (
                <div
                    className="grid place-items-center min-h-screen bg-[#0a0a0a] p-4 !pb-40">
                    <div className="w-full max-w-xl z-10 flex flex-col gap-4">
                        <label className="text-white text-lg font-bold flex items-center gap-2">
                            분석 할 주소를 입력해 주세요.<span className="text-xl"></span>
                        </label>

                        <input value={domain!} onChange={(e => setDomain(e.target.value))}
                               type="text"
                               placeholder="google.com"
                               className="w-full bg-[#0a0a0a] border border-zinc-700 text-zinc-300 p-4 text-xl rounded-md focus:outline-none focus:border-zinc-500 transition-colors"
                        />

                        <button
                            disabled={isAnalyzing}
                            onClick={() => createWebAnalyzeRequest()}
                            className="relative group overflow-hidden rounded-md p-[1px] w-full cursor-pointer"
                        >
                            <div
                                className="absolute inset-0 bg-teal-900 transition-all duration-300 ease-out"
                                style={{width: `${progress}%`}}
                            />
                            <div
                                className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#111_0%,#000_70%,#737373_100%)]"/>
                            <div
                                className="relative bg-[#0a0a0a] w-full py-4 rounded-md flex flex-col items-center justify-center">
                            <span className="text-zinc-400 text-2xl font-bold">
                                {isAnalyzing ? `분석중... ${progress}%` : "분석하기"}
                            </span>
                            </div>
                        </button>
                    </div>

                    {isShowAlert && (
                        <div className="absolute right-6 bottom-6">
                            <div className="bg-red-400 px-4 py-1.5 rounded-md text-white font-bold text-sm">
                                {errorMessage}
                            </div>
                        </div>
                    )}
                </div>
            ) : (<WebAnalyzeComponent data={webCheck}/>)
            }
        </div>
    )
}