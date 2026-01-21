import {TableValueProps} from "@/constants/table";

const TableValueComponent = ({value}: TableValueProps) => {
    return (
        <div tabIndex={0}
             className="border-b border-zinc-800 min-h-9 text-white flex p-2 border-r items-center text-xs min-w-64 focus:ring-1 focus:ring-sky-400 cursor-pointer">
            {value}
        </div>
    )
}

export default TableValueComponent