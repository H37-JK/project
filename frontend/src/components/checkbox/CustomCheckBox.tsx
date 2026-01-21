interface CustomCheckBoxProps {
    id: string
}

const CustomCheckBox = ({id}: CustomCheckBoxProps) => {
    return (
        <label htmlFor={id} className="flex items-center cursor-pointer">
            <input type="checkbox" id={id} className="sr-only peer"/>
            <div className="relative w-4 h-4 border border-zinc-800 rounded-sm bg-zinc-700 peer-checked:bg-zinc-800 peer-checked:border-zinc-800
                            after:content-['']
                            after:absolute
                            after:hidden
                            peer-checked:after:block
                            after:left-[5px]
                            after:top-[2px]
                            after:w-[5px]
                            after:h-[10px]
                            after:border-solid
                            after:border-zinc-300
                            after:border-b-[3px]
                            after:border-r-[3px]
                            after:transform
                            after:rotate-45">
            </div>
        </label>
    )
}

export default CustomCheckBox