import {IoMdKey} from "react-icons/io";
import {MdKeyboardArrowDown} from "react-icons/md";
import {TableColumnProps} from "@/constants/table";


const TableColumnComponent = ({primaryKey, name, type}: TableColumnProps)=> {
    return (
        <div
            className="flex items-center min-h-10 bg-[#1f1f1f] p-2 px-3 border-r text-xs gap-2 border-zinc-800 border-b min-w-64">
            {primaryKey && <IoMdKey className="h-3.5 w-3.5 fill-green-500"/>}
            <div>{name}</div>
            <div className="text-zinc-500">{type}</div>
            <div className="flex flex-1 justify-end">
                <div className="cursor-pointer">
                    <MdKeyboardArrowDown className="h-3.5 w-3.5 fill-zinc-700"/>
                </div>
            </div>
        </div>
    )
}

export default TableColumnComponent