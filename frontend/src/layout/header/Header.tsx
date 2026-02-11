import Image from "next/image";
import {AiFillAlert, AiFillAliwangwang} from "react-icons/ai";
import {IoTerminal} from "react-icons/io5";
import {useSession, signOut} from "next-auth/react";
import { IoMdLogOut } from "react-icons/io";
const Header = () => {
    const { data: session, status} = useSession()
    return (
        <div className="flex flex-row border-b border-zinc-800 p-3 !py-2 text-sm">
            {/*왼쪽*/}
            <div className="flex items-center space-x-3">
                <div>{session?.user?.email}님 안녕하세요.</div>
            </div>
            {/*오른쪽*/}
            <div className="flex flex-1 justify-end items-center pr-3 space-x-3">
                <div
                    className="hidden md:block border text-sm border-zinc-700 hover:border-white transition-all duration-200 cursor-pointer px-3 py-1 rounded-full">
                    Feedback
                </div>
                <div className="flex overflow-hidden rounded-full border border-zinc-700">
                    <button
                        className="group px-3 pr-2 items-center justify-center py-1 transition-colors cursor-pointer hover:bg-zinc-700">
                        <AiFillAlert className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-white"/>
                    </button>
                    <button
                        className="group px-3 items-center justify-center pl-2 border-zinc-700 py-1 transition-colors cursor-pointer hover:bg-zinc-700">
                        <AiFillAliwangwang
                            className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-white"/>
                    </button>
                    <button
                        className="group px-3 items-center justify-center pl-2 border-zinc-700 py-1 transition-colors cursor-pointer hover:bg-zinc-700">
                        <IoTerminal className="h-5 w-5 text-zinc-300 transition-colors group-hover:text-white"/>
                    </button>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/auth"})} type="button"
                        className="w-5 h-5 bg-zinc-300 rounded-full border-zinc-500 text-black cursor-pointer">A
                </button>
            </div>
        </div>
    )
}

export default Header;