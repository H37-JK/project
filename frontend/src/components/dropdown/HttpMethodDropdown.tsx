import { motion, AnimatePresence } from 'framer-motion';
import {ApiRequestUpdate} from "@/constants/api";
import React from "react";

export interface DropdownState {
    httpMethod: boolean;
    content: boolean;
    auth: boolean;
}

interface HttpMethodDropdownProps {
    dropdowns: DropdownState
    setDropdowns: React.Dispatch<React.SetStateAction<DropdownState>>
    updateField: (key: keyof ApiRequestUpdate, value: any) => void
}

const HttpMethodDropdown = ({dropdowns, setDropdowns, updateField} : HttpMethodDropdownProps) => {


    const methods = [
        { label: 'GET', color: 'text-emerald-400' },
        { label: 'POST', color: 'text-amber-500' },
        { label: 'PUT', color: 'text-sky-400' },
        { label: 'PATCH', color: 'text-purple-400' },
        { label: 'DELETE', color: 'text-red-500' },
        { label: 'HEAD', color: 'text-teal-400' },
        { label: 'OPTIONS', color: 'text-indigo-400' },
        { label: 'CONNECT', color: 'text-zinc-400' },
        { label: 'TRACE', color: 'text-zinc-400' },
        { label: 'CUSTOM', color: 'text-zinc-400' },
    ];

    return (
        <>
                {dropdowns.httpMethod && (
                    <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -1, scale: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -1, scale: 1 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                         className={`absolute top-4 left-8 z-10 w-48 mt-3 origin-top-left bg-[#1a1a1a] border 
                         border-zinc-800 rounded-md shadow-2xl focus:outline-none 
                         transition-all duration-2200 ease-out ${dropdowns.httpMethod ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
                    >
                        <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#1a1a1a] border-t border-l border-zinc-800 rotate-45"></div>
                        <div className="py-2 overflow-hidden rounded-md">
                            {methods.map((method) => (
                                <button
                                    key={method.label}
                                    onClick={() => {
                                        setDropdowns((prev) => ({...prev, httpMethod: false}));
                                        updateField('method', method.label)
                                    }}
                                    className={`cursor-pointer block w-full px-5 py-2.5 text-left text-sm font-bold transition-colors hover:bg-zinc-800 ${method.color}`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                    </AnimatePresence>
                )}
        </>
    );
};

export default HttpMethodDropdown;