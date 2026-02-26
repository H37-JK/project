import {CiTrash} from "react-icons/ci";
import React from "react";

interface QueryParameterProps {
    data: Record<string, any>
    index: number
    deleteFiled: (index: number) => void
    updateFiled: (index: number, key: string, value: any) => void
}

const QueryParameterComponent = ({data, index, deleteFiled, updateFiled} : QueryParameterProps) => {


    return (
        <div>
            <div className="flex flex-1">
                <input type="text" placeholder="키" value={data.key} onChange={(e) => updateFiled(index,'key', e.target.value)}
                       className="outline-none basis-9/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <input type="text" placeholder="값" value={data.value} onChange={(e) => updateFiled(index,'value', e.target.value)}
                       className="outline-none basis-9/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <input type="text" placeholder="설명" value={data.desc} onChange={(e) => updateFiled(index,'desc', e.target.value)}
                       className="outline-none basis-8/28 border-r py-2 px-3 border-b border-zinc-800"/>
                <div
                    className="outline-none basis-1/28  border-r py-2 px-3 border-b border-zinc-800 flex items-center">
                    {data.active ? (
                        <svg onClick={() => {
                            updateFiled(index, 'active', false)
                        }} viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons fill-green-500 text-green-600 cursor-pointer">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                               strokeWidth="2">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                                <path d="m9 11l3 3L22 4"></path>
                            </g>
                        </svg>
                    ) : (
                        <svg onClick={() => {
                            updateFiled(index, 'active', true)
                        }} viewBox="0 0 24 24" width="1.2em" height="1.2em"
                             className="svg-icons fill-green-500 text-green-600 cursor-pointer">
                            <circle className="" cx="12" cy="12" r="10" fill="none" stroke="currentColor"
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                        </svg>
                    )}
                </div>
                <div
                    className="outline-none  basis-1/28 border-r py-2 px-3 border-b border-zinc-800 flex items-center cursor-pointer">
                    <CiTrash onClick={() => deleteFiled(index)} className="h-4 w-4 fill-rose-400 group-hover:fill-red-500"/>
                </div>
            </div>
        </div>
    )
}

export default QueryParameterComponent