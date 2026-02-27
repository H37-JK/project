'use client';

import {Check} from 'lucide-react';
import {ApiRequestUpdate} from "@/constants/api";
import {DropdownState} from "@/components/dropdown/HttpMethodDropdown";
import React from "react";

interface contentTypeDropDownProps {
    dropdowns: DropdownState
    setDropdowns: React.Dispatch<React.SetStateAction<DropdownState>>
    updateField:(key: keyof ApiRequestUpdate, value: any) => void
    selected: string
}

const contentTypes = [
    {
        group: 'Text',
        items: [
            'application/json',
            'application/ld+json',
            'application/hal+json',
            'application/vnd.api+json',
            'application/xml',
            'text/xml',
        ],
    },
    {
        group: 'Structured',
        items: [
            'application/x-www-form-urlencoded'
            ,'multipart/form-data'
        ],
    },
]

const ContentTypeDropdown = ({dropdowns, setDropdowns, updateField, selected}: contentTypeDropDownProps) => {
    return (
       <>
           {dropdowns.content && (
               <div className="absolute top-8 left-1 z-50 w-[300px]">
                   <div
                       className="absolute -top-2 left-8 w-4 h-4 bg-[#1e1e1e] border-t border-l border-[#333] transform rotate-45 z-0 rounded-sm"></div>
                   <div
                       className="relative z-10 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl flex flex-col max-h-[400px]">
                       <div className="overflow-y-auto overflow-x-hidden custom-scrollbar">
                           {contentTypes.map((section, idx) => (
                               <div key={idx} className="mb-2">
                                   <div className="px-4 py-2 mt-2 text-xs font-bold text-gray-500">
                                       {section.group}
                                   </div>

                                   {section.items.map((item) => {
                                       const isSelected = selected === item;
                                       return (
                                           <button
                                               key={item}
                                               onClick={() => {
                                                   updateField('body_type', item);
                                                   setDropdowns((prev) => ({...prev, content: false}));
                                               }}
                                               className={`cursor-pointer w-full flex items-center justify-between px-4 py-2 text-sm transition-colors
                                              ${isSelected ? 'bg-[#2a2a2a] text-white font-semibold' : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'}
                                              `}
                                           >
                                               <span>{item}</span>
                                               {isSelected && <Check className="w-4 h-4 text-indigo-500"/>}
                                           </button>
                                       );
                                   })}
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
           )}
       </>
    )
}

export default ContentTypeDropdown