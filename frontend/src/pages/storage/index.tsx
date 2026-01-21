import {LuRefreshCw} from "react-icons/lu";
import {ImSpinner2} from "react-icons/im";
import {useState} from "react";
import {MdTextSnippet} from "react-icons/md";
import {IoIosArrowForward} from "react-icons/io";
import {FiUpload} from "react-icons/fi";
import {FaFolderPlus} from "react-icons/fa";
import {CiSearch} from "react-icons/ci";
import {IoSearchOutline} from "react-icons/io5";
import {MdCancel} from "react-icons/md";
import {MdOutlineCancel} from "react-icons/md";
import CancelIconCompomponent from "@/components/icon/CancelIconCompomponent";
import Image from "next/image";
import {GoDownload} from "react-icons/go";
import {FaCopy} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";

export default function Home() {

    const [email, setEmail] = useState('these990703@gmail.com')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [isSearchToggle, setIsSearchToggle] = useState(false)
    const [isFileToggle, setIsFileToggle] = useState(true)

    const handleRefresh = () => {
        setIsRefreshing(true)

        setTimeout(() => {
            setIsRefreshing(false)
        }, 1500)
    }

    const handelIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const handleIsSearchToggle = () => {
        setIsSearchToggle(!isSearchToggle)
    }

    const handleIsFileToggle = () => {
        setIsFileToggle(!isFileToggle)
    }

    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            <div style={{flex: '15.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-12 px-6 flex items-center">
                    <h4 className="text-lg">스토리지</h4>
                </div>


                {/*스토리지 리스트*/}
                <div className="flex flex-col text-sm overflow-auto border-b border-zinc-800 mb-2">
                    <h4 className="text-ms py-1 p-4 text-zinc-400">저장소</h4>
                    <div
                        className="flex group items-center  cursor-pointer hover:bg-zinc-800 p-4 py-1.5 gap-2 text-md">
                        <div><MdTextSnippet className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                        <div className="text-zinc-300 group-hover:text-white">파일</div>
                    </div>
                </div>

            </div>

            <div style={{flex: '84.5 1 0px'}} className="flex flex-col overflow-hidden">
                {/*컨텐츠*/}
                <div className="p-3 px-6 flex flex-col flex-1 overflow-hidden">
                    <div className="flex space-x-1.5 items-center">
                        <h2 className="text-md text-zinc-500">파일</h2>
                        <div><IoIosArrowForward className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                        <div>이미지</div>
                    </div>

                    <div className="border border-zinc-800 rounded-md flex flex-1 flex-col m-0.5 mt-3 overflow-hidden">
                        <div className="border-b border-zinc-800 bg-[rgba(31,31,31,0.5)]">
                            <div
                                className="flex items-center flex-1 justify-end p-2 py-1 text-xs space-x-4">
                                <div onClick={handleRefresh} className="flex items-center text-xs cursor-pointer hover:bg-zinc-800 pr-1 rounded-md">
                                    <div
                                        className="flex items-center justify-center rounded px-1.5 py-1.5 cursor-pointer">
                                        {!isRefreshing ?
                                            <LuRefreshCw className="h-3.5 w-3.5"/> :
                                            <ImSpinner2 className="h-3.5 w-3.5 animate-spin"/>}
                                    </div>
                                    <div>새로고침</div>
                                </div>
                                <div className="flex items-center cursor-pointer hover:bg-zinc-800 pr-1 rounded-md">
                                    <div
                                        className="flex items-center justify-center rounded px-1.5 py-1.5 cursor-pointer">
                                        <FaFolderPlus className="h-3.5 w-3.5"/>
                                    </div>
                                    <div>폴더생성</div>
                                </div>
                                <div className="flex items-center cursor-pointer hover:bg-zinc-800 pr-1 rounded-md">
                                    <div
                                        className="flex items-center justify-center rounded px-1.5 py-1.5 cursor-pointer">
                                        <FiUpload className="h-3.5 w-3.5"/>
                                    </div>
                                    <div>업로드</div>
                                </div>

                                {isSearchToggle && <div
                                    className={`flex items-center relative transition-all duration-1500 ease-linear ${isSearchToggle ? 'min-w-16' : 'min-w-0'}`}>
                                    <div className="absolute top-1 left-1">
                                        <IoSearchOutline className="h-3.5 w-3.5"/>
                                    </div>
                                    <input
                                        className="outline outline-zinc-700 rounded-md py-0.5 pl-5 pr-5 focus:outline-zinc-600"
                                        type="text"/>
                                    <div onClick={handleIsSearchToggle}
                                         className="absolute top-1 right-1 bg-zinc-800 cursor-pointer">
                                        <CancelIconCompomponent/>
                                    </div>
                                </div>
                                }

                                {isSearchToggle ||
                                    <div onClick={handleIsSearchToggle} className="flex items-center hover:bg-zinc-800 pr-1 rounded-md">
                                        <div
                                            className="flex items-center justify-center rounded px-1.5 py-1.5 cursor-pointer">
                                            <IoSearchOutline className="h-3.5 w-3.5"/>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="flex flex-1 text-sm overflow-hidden">
                            <div
                                className="flex-1 flex-col border-r overflow-auto max-h-full divide-y divide-zinc-800 border-zinc-800 hidden md:flex"
                                style={{flex: '22 1 0px'}}>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                                <div
                                    className="min-h-8 flex items-center px-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800">test
                                </div>
                            </div>
                            <div className="flex flex-1" style={{flex: '78 1 0px'}}>
                                <div className="hidden md:flex flex-1"></div>

                                {/*파일 정보*/}
                                {isFileToggle &&
                                    <div className="flex justify-end bg-[rgba(31,31,31,0.5)] w-full md:w-2/5 p-3">
                                        <div className="flex flex-col space-y-2 w-full p-3">
                                            <div className="flex justify-end" onClick={handleIsFileToggle}>
                                                <CancelIconCompomponent/></div>
                                            <div className="border border-zinc-700 flex flex-1 max-h-68 mb-5">
                                                <div
                                                    className="flex w-full h-auto items-center justify-center bg-contain bg-center bg-no-repeat bg-[url(https://jekqhvopmyflluxqqxll.supabase.co/storage/v1/object/sign/images/KakaoTalk_20251002_122923622_26.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lYzUzOTNhNC1iNDc4LTQzZjktYjA5OC01YTFlMWNiNjI3OTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvS2FrYW9UYWxrXzIwMjUxMDAyXzEyMjkyMzYyMl8yNi5qcGciLCJpYXQiOjE3NjMwMDQ2MjksImV4cCI6MTc2MzYwOTQyOX0.gPVo8xQ1Rn7XUXZ1rsBxkb3DuIWGAs9r6Rvhqjmqqes)]"></div>
                                                {/*<video src="https://jekqhvopmyflluxqqxll.supabase.co/storage/v1/object/sign/images/123/ForBiggerBlazes.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lYzUzOTNhNC1iNDc4LTQzZjktYjA5OC01YTFlMWNiNjI3OTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMTIzL0ZvckJpZ2dlckJsYXplcy5tcDQiLCJpYXQiOjE3NjMwMTQ5NjMsImV4cCI6MTc2MzYxOTc2M30.NsrgvSeGlmVrSpiSNUqGkUb4h0e_EionXuNGWG3uNWY" autoPlay="true" muted="true" className="h-full w-full"/>*/}
                                            </div>
                                            <h2 className="text-xl">베어브릭 사진.jpg</h2>
                                            <span className="text-zinc-400">image/jpeg - 4.62MB</span>
                                            <div className="text-zinc-500 text-xs mt-3">생성일</div>
                                            <div className="text-zinc-400">2025.11.13 오후 3:31:42</div>
                                            <div className="text-zinc-500 text-xs mt-3">수정일</div>
                                            <div className="text-zinc-400">2025.11.13 오후 3:31:42</div>

                                            <div className="flex space-x-1 mt-2 -ml-1">
                                                <button type="button"
                                                        className="border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><GoDownload className="h-3.5 w-3.5"/></div>
                                                    <div>다운로드</div>
                                                </button>
                                                <button type="button"
                                                        className="border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><FaCopy className="h-3.5 w-3.5"/></div>
                                                    <div>링크복사</div>
                                                </button>
                                                <button type="button"
                                                        className="border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><RiDeleteBin6Line className="h-3.5 w-3.5"/>
                                                    </div>
                                                    <div>삭제</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                        </div>

                    </div>

                </div>


            </div>
        </div>
    )
}
