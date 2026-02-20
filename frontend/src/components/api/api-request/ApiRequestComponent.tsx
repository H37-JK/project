import {HiX} from "react-icons/hi";
import React from "react";

interface ApiRequestComponentProps {
    name: string;
    method: string;
    onDelete: () => void;
    onGet: () => void;
    isActive: boolean;
}

const ApiRequestComponent = ({name, method, onDelete, onGet, isActive} : ApiRequestComponentProps) => {
    return (
        <div onClick={() => onGet()} className={"border-r border-zinc-800 group cursor-pointer hover:opacity-90 hover:bg-zinc-800 " + ( isActive ?  "opacity-90 bg-zinc-800" : "")}>
            <div
                className="text-xs gap-2 flex items-center justify-center flex-1 h-full px-2">
                <div className="gap-1 cursor-pointer flex ">
                    <div className="text-green-400">{method}</div>
                    <div className="group-hover:text-white">{name}</div>
                </div>
                <div className="invisible group-hover:visible"><HiX onClick={() => onDelete()}
                    className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
            </div>
        </div>

    )
}

export default ApiRequestComponent