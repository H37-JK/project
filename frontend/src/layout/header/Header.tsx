import Image from "next/image";
import {AiFillAlert, AiFillAliwangwang} from "react-icons/ai";
import {IoTerminal} from "react-icons/io5";
import {useState} from "react";

const Header = () => {
    const [email, setEmail] = useState('these990703@gmail.com')

    return (
        <div className="flex flex-row border-b border-zinc-800 p-3 !py-2 text-sm">
            {/*왼쪽*/}
            <div className="flex items-center space-x-3">
                <Image
                    className="dark:invert"
                    src="/vercel.svg"
                    alt="Vercel logomark"
                    width={16}
                    height={16}
                />
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" className="text-zinc-500"
                     strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none"
                     shapeRendering="geometricPrecision" data-sentry-element="svg"
                     data-sentry-source-file="LayoutHeader.tsx">
                    <path d="M16 3.549L7.12 20.600" data-sentry-element="path"
                          data-sentry-source-file="LayoutHeader.tsx"></path>
                </svg>
                <div>{email}</div>
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
                <button type="button"
                        className="w-5 h-5 bg-zinc-300 rounded-full border-zinc-500 text-black cursor-pointer">A
                </button>
            </div>
        </div>
    )
}

export default Header;