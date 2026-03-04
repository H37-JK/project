'use client';

import {ApiRequestUpdate} from "@/constants/api";
import {DropdownState} from "@/components/dropdown/HttpMethodDropdown";
import React from "react";

interface contentTypeDropDownProps {
    dropdowns: DropdownState
    setDropdowns: React.Dispatch<React.SetStateAction<DropdownState>>
    updateField: (key: keyof ApiRequestUpdate, value: any) => void
    selected: string
}

const authOptions = [
    "None", "Bearer",
];

const AuthTypeDropdown = ({dropdowns, setDropdowns, updateField, selected}: contentTypeDropDownProps) => {
    return (
        <>
            {dropdowns.auth && (
                <div className="absolute top-8 left-1 z-50 w-[220px]">
                    <div
                        className="absolute -top-2 left-8 w-4 h-4 bg-[#1e1e1e] border-t border-l border-[#333] transform rotate-45 z-0 rounded-sm"></div>
                    <div
                        className="relative py-2 z-10 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl flex flex-col max-h-[400px]">
                        <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {authOptions.map((option) => {
                                        const isSelected = selected === option;
                                        return (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    updateField('auth_type', option)
                                                    setDropdowns((prev) => ({...prev, auth: false}));
                                                }}
                                                className={`flex items-center cursor-pointer w-full px-4 py-2 text-sm transition-colors hover:bg-[#333333] ${
                                                    isSelected ? "text-indigo-400" : "text-gray-300"
                                                }`}
                                            >
                                                <div
                                                    className={`mr-3 flex items-center justify-center w-4 h-4 rounded-full border ${
                                                        isSelected ? "border-indigo-500" : "border-gray-500"
                                                    }`}>
                                                    {isSelected && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"/>
                                                    )}
                                                </div>

                                                <span className={`isSelected ? "font-bold" : "font-normal" text-sm`}>
                                                    {option}
                                                </span>
                                            </button>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AuthTypeDropdown