import React from "react";

interface TooltipProps {
    data: any
    isFirst?: boolean
}

const TooltipComponent = ({data, isFirst} : TooltipProps) => {
    return (
        <div className={`absolute left-0 !z-999 invisible opacity-0 
                        group-hover/text:visible group-hover/text:opacity-100 
                        transition-all duration-200 pointer-events-none
                        ${isFirst ? 'top-full mt-2' : 'bottom-full mb-2'} 
                        `}>

            <div className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-[12px] leading-tight
                            rounded-md px-2 py-1.5 shadow-2xl w-48 whitespace-normal break-all">
                {data}

                <div className={`absolute left-3 w-2 h-2 bg-zinc-900 border-zinc-700 transform rotate-45
            ${isFirst
                    ? '-top-1 border-t border-l' // 툴팁이 아래에 있을 때 (화살표는 위쪽)
                    : '-bottom-1 border-r border-b' // 툴팁이 위에 있을 때 (화살표는 아래쪽)
                }`}>
                </div>
            </div>
        </div>
    )
}

export default TooltipComponent