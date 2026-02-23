import {CiTrash} from "react-icons/ci";
import React, {useState} from "react";

interface QueryParameterProps {
    index: number
    deleteParam: (index: number) => void
    updateParam: (index: number, key: string, value: any) => void
}

const QueryParameterComponent = ({index, deleteParam, updateParam} : QueryParameterProps) => {
    const [showCheck, setShowCheck] = useState<boolean>(true)

    return (
        <div className="flex flex-1">
            <div className="flex flex-1">
                <input type="text" placeholder="키"
                       className="outline-none basis-9/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <input type="text" placeholder="값"
                       className="outline-none basis-9/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <input type="text" placeholder="설명"
                       className="outline-none basis-8/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <div
                    className="outline-none basis-1/28  border-r py-2 px-3 border-b border-zinc-800 flex items-center">
                    {showCheck ? (
                        <svg onClick={() => {
                            setShowCheck(!showCheck);
                            updateParam(index, 'active', false)
                        }} viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons fill-green-500 text-green-600 cursor-pointer">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                               strokeWidth="2">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11l3 3L22 4"></path>
                            </g>
                        </svg>
                    ) : (
                        <svg onClick={() => {
                            setShowCheck(!showCheck)
                            updateParam(index, 'active', true)
                        }} viewBox="0 0 24 24" width="1.2em" height="1.2em"
                             className="svg-icons fill-green-500 text-green-600 cursor-pointer">
                            <circle className="" cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                        </svg>
                    )}
                </div>
                <div
                    className="outline-none  basis-1/28 border-r py-2 px-3 border-b border-zinc-800 flex items-center cursor-pointer">
                    <CiTrash onClick={() => deleteParam(index)} className="h-4 w-4 fill-rose-400 group-hover:fill-red-500"/>
                </div>
            </div>
        </div>
    )
}

export default QueryParameterComponent