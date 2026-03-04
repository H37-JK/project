import {LuRefreshCw} from "react-icons/lu";
import {ImSpinner2} from "react-icons/im";
import {IoIosArrowForward} from "react-icons/io";
import {FiUpload} from "react-icons/fi";
import {FaFolderPlus} from "react-icons/fa";
import {IoSearchOutline} from "react-icons/io5";
import CancelIconCompomponent from "@/components/icon/CancelIconCompomponent";
import {GoDownload} from "react-icons/go";
import {FaCopy} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import {useStorageUIHooks} from "@/hooks/storage/ui/useStorageUIHooks";
import {useStorageDataHooks} from "@/hooks/storage/data/useStorageDataHooks";
import ToolTipComponent from "@/components/tooltip/TooltipComponent";
import React, {useMemo} from "react";
import formatDate from "@/lib/date"
import {formatBytesToHumanReadable} from "@/lib/file";

export default function Home() {
    const {id, setId, files, file, handleFileOnChange, handleDownload, fileUploadRequest, deleteFileRequest} = useStorageDataHooks()
    const {isRefreshing, isMenuToggle, isSearchToggle, isFileToggle, showTrash, setShowTrash, searchValue, setSearchValue, isShowAlert, setIsShowAlert, alertMessage, setAlertMessage, handleRefresh, handleIsMenuToggle, handleIsSearchToggle, handleIsFileToggle, fileRef, onFileClick, handleCopyLink, handleIsShowAlert} = useStorageUIHooks()

    const filteredFiles = useMemo(() => {
        if (!files) {
            return [];
        }
        if (!searchValue) {
            return files;
        }
        return files.filter(file => file.filename.includes(searchValue));
    }, [files, searchValue]);



    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            {/*<div style={{flex: '15.5 1 0px'}}*/}
            {/*     className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>*/}
            {/*    <div className="border-b border-zinc-800 min-h-10 px-4 flex items-center">*/}
            {/*        <h4 className="text-md">스토리지</h4>*/}
            {/*        <div className="flex flex-1 justify-end">*/}
            {/*            <LuPencilLine onClick={() => setShowTrash(!showTrash)}*/}
            {/*                          className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-300"/>*/}
            {/*        </div>*/}
            {/*    </div>*/}


            {/*    /!*스토리지 리스트*!/*/}
            {/*    <div className="flex flex-col text-sm overflow-auto border-b border-zinc-800 mb-2">*/}
            {/*        <div*/}
            {/*            className="flex group items-center  cursor-pointer hover:bg-zinc-800 p-4 py-1.5 gap-2 text-md">*/}
            {/*            <div><MdTextSnippet className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>*/}
            {/*            <div className="text-zinc-300 group-hover:text-white">파일</div>*/}
            {/*        </div>*/}
            {/*    </div>*/}

            {/*</div>*/}

            <div style={{flex: '100 1 0px'}} className="flex flex-col overflow-hidden">
                <div className="border-b border-zinc-800 min-h-10 flex">

                    <div className="flex space-x-1.5 items-center ml-2">
                        <h2 className="text-md text-zinc-500">파일</h2>
                        <div><IoIosArrowForward className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                        <div>이미지</div>
                    </div>

                </div>


                {/*컨텐츠*/}
                <div className="p-3 px-6 flex flex-col flex-1 overflow-hidden">
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
                                {/*<div className="flex items-center cursor-pointer hover:bg-zinc-800 pr-1 rounded-md">*/}
                                {/*    <div*/}
                                {/*        className="flex items-center justify-center rounded px-1.5 py-1.5 cursor-pointer">*/}
                                {/*        <FaFolderPlus className="h-3.5 w-3.5"/>*/}
                                {/*    </div>*/}
                                {/*    <div>폴더생성</div>*/}
                                {/*</div>*/}
                                <input
                                    type="file"
                                    ref={fileRef}
                                    onChange={handleFileOnChange}
                                    style={{ display: 'none' }}
                                    accept="image/*, video/*"
                                />
                                <div onClick={onFileClick} className="flex items-center cursor-pointer hover:bg-zinc-800 pr-1 rounded-md">
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
                                    <input value={searchValue!} onChange={(e) => setSearchValue(e.target.value)}
                                        className="outline outline-zinc-700 rounded-md py-0.5 pl-5 pr-5 focus:outline-zinc-600"
                                        type="text"/>
                                    <div onClick={() => {
                                        handleIsSearchToggle()
                                        setSearchValue(null)
                                    }}
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
                                {filteredFiles && filteredFiles
                                    .map((data, key) => (
                                    <div onClick={() => setId(data.id)} className={`relative min-w-0 group/text cursor-pointer ${id === data.id ? 'bg-zinc-800' : 'bg-zinc-900'} hover:bg-zinc-800`} key={key}>
                                        <div className="p-2 px-4 truncate w-full" title={data.filename}>
                                            {data.filename}
                                        </div>

                                        <ToolTipComponent data={data.filename} isFirst={key === 0}/>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-1" style={{flex: '78 1 0px'}}>
                                <div className="hidden md:flex flex-1"></div>

                                {/*파일 정보*/}
                                {isFileToggle &&
                                    <div className="flex justify-end bg-[rgba(31,31,31,0.5)] w-full md:w-3/5 p-3">
                                        <div className="flex flex-col space-y-2 w-full p-3">
                                            {/*<div className="flex justify-end" onClick={handleIsFileToggle}>*/}
                                            {/*    <CancelIconCompomponent/></div>*/}
                                            <div className="w-full h-96 border border-zinc-700 mb-5 overflow-hidden bg-zinc-900/50 flex items-center justify-center">
                                                {file && file?.url ?
                                                file.url.match(/\.(mp4|webm|ogg)$/i) ? (
                                                    <video
                                                        src={file?.url}
                                                        autoPlay
                                                        muted
                                                        controls
                                                        playsInline
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <img
                                                        src={file?.url}
                                                        alt="Uploaded content"
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                        <div>이미지를 업로드해 주세요.</div>
                                                    )
                                                }
                                            </div>
                                            <h2 className="text-xl">{file ? file.filename : ''}</h2>
                                            <span className="text-zinc-400">{file ? `${file.content_type} - ${formatBytesToHumanReadable(file.size)}` : ''}</span>
                                            <div className="text-zinc-500 text-xs mt-3">생성일</div>
                                            <div className="text-zinc-400">{file ? formatDate(file.create_at) : ''}</div>
                                            <div className="text-zinc-500 text-xs mt-3">수정일</div>
                                            <div className="text-zinc-400">{file ? formatDate(file.update_at) : ''}</div>

                                            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 mt-2 -ml-1 gap-2">
                                                <button type="button" onClick={() => file && handleDownload(file.url, file.filename)}
                                                        className="max-w-24 md:max-w-full border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><GoDownload className="h-3.5 w-3.5"/></div>
                                                    <div>다운로드</div>
                                                </button>
                                                <button type="button" onClick={() => file && handleCopyLink(file.url)}
                                                        className="max-w-24 md:max-w-full border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><FaCopy className="h-3.5 w-3.5"/></div>
                                                    <div>링크복사</div>
                                                </button>
                                                <button type="button" onClick={async () => {
                                                    if (file) {
                                                        await deleteFileRequest()
                                                        setAlertMessage('파일이 삭제 되었습니다')
                                                        handleIsShowAlert()
                                                    }
                                                }}
                                                        className="max-w-24 md:max-w-full border border-zinc-800 rounded-md px-3 space-x-1.5 text-xs py-1 flex items-center cursor-pointer hover:bg-zinc-700">
                                                    <div className="pb-0.5"><RiDeleteBin6Line className="h-3.5 w-3.5"/>
                                                    </div>
                                                    <div>삭제</div>
                                                </button>
                                            </div>
                                        </div>
                                        {isShowAlert && (
                                            <div className="absolute right-6 bottom-6">
                                                <div className="bg-teal-400 px-4 py-1.5 rounded-md text-white font-bold text-sm">
                                                    {alertMessage}
                                                </div>
                                            </div>
                                        )}
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
