import {HiX} from "react-icons/hi";
import React from "react";

interface ApiRequestComponentProps {
    name: string;
    method: string;
    onDelete: () => void;
    onGet: () => void;
    isActive: boolean;
    isDeletable: boolean;
}

const ApiRequestComponent = ({name, method, onDelete, onGet, isActive, isDeletable} : ApiRequestComponentProps) => {
    const methodColorMap: Record<string, string> = {
        GET: "text-emerald-400",
        POST: "text-amber-500",
        PUT: "text-sky-400",
        PATCH: "text-purple-400",
        DELETE: "text-red-500",
        HEAD: "text-teal-400",
        OPTIONS: "text-indigo-400",
        CONNECT: "text-zinc-400",
        TRACE: "text-zinc-400",
        CUSTOM: "text-zinc-400",
    };

    const methodColor = method
        ? methodColorMap[method] ?? "text-zinc-400"
        : "text-zinc-400";
    return (
        <div onClick={() => onGet()} className={"border-r border-zinc-800 group cursor-pointer hover:opacity-90 hover:bg-zinc-800 " + ( isActive ?  "opacity-90 bg-zinc-800" : "")}>
            <div
                className="text-xs gap-2 flex items-center justify-center flex-1 h-full px-2">
                <div className="gap-1 cursor-pointer flex ">
                    <div className={`font-bold mr-1 ${methodColor}`}>{method}</div>
                    <div className="group-hover:text-white">{name}</div>
                </div>
                {!isDeletable ? (
                    <div className="w-3"></div>
                ) : <div className="invisible group-hover:visible">
                    <HiX onClick={() => onDelete()} className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>}
            </div>
        </div>

    )
}

export default ApiRequestComponent