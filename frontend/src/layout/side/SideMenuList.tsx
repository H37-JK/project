import {BiBook} from "react-icons/bi";
import {RiTerminalBoxFill} from "react-icons/ri";
import { TiCloudStorage } from "react-icons/ti";
import { IoChatbubbleEllipses } from "react-icons/io5";
import Link from "next/link";
import { CiMonitor } from "react-icons/ci";
import { IoTerminal } from "react-icons/io5";
import { TbHeartRateMonitor } from "react-icons/tb";
import { PiNotebookDuotone } from "react-icons/pi";
import { FaChrome } from "react-icons/fa";
import { MdOutlineSnippetFolder } from "react-icons/md";
import { MdOutlineTextSnippet } from "react-icons/md";
import { FaPhotoVideo } from "react-icons/fa";
import { MdVideoLibrary } from "react-icons/md";
import { FaCode } from "react-icons/fa6";
import { CiViewTable } from "react-icons/ci"
import { FaTableList } from "react-icons/fa6";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { FaPencilAlt } from "react-icons/fa";

const SideMenuList = () => {
    return (
        <div
            className="px-0 absolute hidden md:flex space-y-1 top-0 bottom-0 w-10 hover:w-60 transition-all duration-150 ease-linear z-[99] border group border-t-0 border-zinc-800 !bg-[#171717] flex-col">
            <Link href="/">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-50 space-x-2">
                    <div>
                        <CiViewTable className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-white"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        테이블 에디터
                    </div>
                </div>
            </Link>
            <Link href="/sql">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <RiTerminalBoxFill
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        쿼리 에디터
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <TiCloudStorage
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        스토리지
                    </div>
                </div>
            </Link>
            <Link href="/api-request">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <svg data-v-485eaaba="" viewBox="0 0 24 24" className="svg-icons h-5 w-5 text-[rgb(137,137,137)] group-hover:text-zinc-200">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                  stroke-width="2" d="M9 17H7A5 5 0 0 1 7 7h2m6 0h2a5 5 0 1 1 0 10h-2m-7-5h8"></path>
                        </svg>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        API
                    </div>
                </div>
            </Link>
            <Link href="/ai">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <TbMessageChatbotFilled
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        AI
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <IoTerminal
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        터미널
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <TbHeartRateMonitor
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        모니터링
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <svg data-v-485eaaba="" viewBox="0 0 24 24" className="svg-icons h-5 w-5 text-[rgb(137,137,137)] group-hover:text-zinc-200">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                               stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"></path>
                            </g>
                        </svg>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        웹체크
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <PiNotebookDuotone
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        노트
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <FaChrome
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        웹
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <MdOutlineSnippetFolder
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        스니펫
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <FaPhotoVideo
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        비디오
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <FaCode
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        코드
                    </div>
                </div>
            </Link>
            <Link href="/storage">
                <div
                    className="p-2 hover:bg-zinc-800 rounded group cursor-pointer flex items-center text-sm text-zinc-200 space-x-2">
                    <div>
                        <FaPencilAlt
                            className="h-5 w-5 text-[rgb(137,137,137)] cursor-pointer group-hover:text-zinc-200"/>
                    </div>
                    <div className="hidden group-hover:flex whitespace-nowrap">
                        스케치
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SideMenuList