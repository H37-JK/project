import {SnippetProps} from "@/constants/sql";
import {BsFiletypeSql} from "react-icons/bs";

const SnippetComponent = ({name}: SnippetProps) => {
    return (
        <div
            className="flex group items-center  cursor-pointer hover:bg-zinc-800 p-4 py-1.5 gap-2 text-md">
            <div><BsFiletypeSql className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
            <div className="text-zinc-300 text-[12px] group-hover:text-white">{name}</div>
            <div className="flex flex-1 justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
                     strokeLinejoin="round"
                     className="lucide lucide-ellipsis-vertical stroke-zinc-500 group-hover:stroke-white hidden group-hover:block hover:bg-gray-600 rounded-md">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                </svg>
            </div>
        </div>
    )
}

export default SnippetComponent