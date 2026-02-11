import React from "react";

interface TooltipProps {
    data: any
    isFirst?: boolean
}

const TooltipComponent = ({data, isFirst} : TooltipProps) => {
    return (
        <div className={`absolute left-0 z-50 invisible opacity-0 
                        group-hover/text:visible group-hover/text:opacity-100 
                        transition-all duration-200 pointer-events-none
                        ${isFirst ? 'top-full mt-2' : 'bottom-full mb-2'} 
                        `}>

            <div className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-[12px] leading-tight
                            rounded-md px-2 py-1.5 shadow-2xl w-48 whitespace-normal break-all">
                {data}

                {isFirst ? (
                    <div className="absolute bottom-full left-3 -mb-px border-4 border-transparent border-b-zinc-900"></div>
                ) : (
                    <div className="absolute top-full left-3 -mt-px border-4 border-transparent border-t-zinc-900"></div>
                )}
            </div>
        </div>
    )
}

export default TooltipComponent