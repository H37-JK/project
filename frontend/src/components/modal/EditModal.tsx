import React, {useEffect, useState} from 'react';
import {X, Info} from 'lucide-react';
import {ApiRequestUpdate} from "@/constants/api";
import {useApiDataHooks} from "@/hooks/api-request/data/useApiDataHooks";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    selectedId: string,
    selectedName: string
    updateField: () => void
}

const EditModal = ({isOpen, onClose, title, children, selectedId, selectedName, updateField}: ModalProps) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/15 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-lg bg-[#0a0a0a] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/20">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {/*<div className="w-1 h-5 bg-teal-500 rounded-full" />*/}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <div className="px-6 py-8 text-zinc-300">
                    {children}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-900/10">
                    <button onClick={() => updateField()}
                        className="cursor-pointer border border-zinc-800 px-4 rounded-md py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        변경
                    </button>

                    <button
                        onClick={onClose}
                        className="cursor-pointer border border-zinc-800 rounded-md px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;