import {IoLogoChrome} from "react-icons/io5";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import {GoPlus} from "react-icons/go";
import React, {useRef} from "react";
import {IoIosArrowDown} from "react-icons/io";
import {FaPlus} from "react-icons/fa6";
import JsonEditor from "@/components/editor/JsonEditor";
import {IoIosSave} from "react-icons/io";
import {LuPencilLine} from "react-icons/lu";
import SkeletonComponent from "@/components/skeleton/SkeletonComponent";
import ToolTipComponent from "@/components/tooltip/TooltipComponent";
import ApiRequestComponent from "@/components/api/api-request/ApiRequestComponent";
import HttpMethodDropdown from "@/components/dropdown/HttpMethodDropdown";
import QueryParameterComponent from "@/components/api/api-request/QueryParameterComponent";
import ContentTypeDropdown from "@/components/dropdown/ContentTypesDropdown";
import CodeEditor from "@/components/editor/CodeEditor";
import SpinnerComponent from "@/components/spinner/SpinnerComponent";
import AuthTypeDropdown from "@/components/dropdown/AuthTypeDropdown";
import {useApiDataHooks} from "@/hooks/api-request/data/useApiDataHooks";
import {useUIHooks} from "@/hooks/common/ui/useUIHooks";
import {useApiUIHooks} from "@/hooks/api-request/ui/useApiUIHooks";
import {useSession} from "next-auth/react";
import {CiTrash} from "react-icons/ci";
import ConfirmModal from "@/components/modal/ConfirmModal";
import {FaRegEdit} from "react-icons/fa";
import {MdModeEditOutline} from "react-icons/md";
import DarkModal from "@/components/modal/EditModal";

const methodColorMap: Record<string, string> = {
    GET: "text-emerald-400",
    POST: "text-amber-500",
    PUT: "text-sky-400",
    PATCH: "text-purple-400",
    DELETE: "text-red-500",
    HEAD: "text-teal-400",
    OPTIONS: "text-indigo-400",
    CONNECT: "text-zinc-400",
    TRACE: "text-zinc-400",
    CUSTOM: "text-zinc-400",
};

export default function Home() {
    const {
        id,
        setId,
        file,
        setFile,
        handleButtonClick,
        fileInputRef,
        handleFileOnChange,
        requestData,
        setRequestData,
        historyData,
        apis,
        api,
        apisIsLoading,
        errorMessage,
        histories,
        historiesLoading,
        createApiRequest,
        deleteApiRequest,
        callApiRequest,
        callMutating,
        updateField,
        addDict,
        updateDict,
        deleteDict,
        saveTimerRef,
        latestIdRef,
        latestRequestDataRef,
        pretty
    } = useApiDataHooks()
    const {
        activeMenu,
        setActiveMenu,
        activeTab,
        setActiveTab,
        tabs,
        isShowAlert,
        setIsShowAlert,
        editModalOpen,
        setEditModalOpen,
        selectedId,
        setSelectedId,
        selectedName,
        setSelectedName,
        alertMessage,
        setAlertMessage,
        handleDeleteClick,
        isModalOpen,
        setIsModalOpen,
        showTrash,
        setShowTrash,
        dropdowns,
        setDropdowns,
        toggleDropdown,
        isMenuToggle,
        setIsMenuToggle,
        httpMethodRef,
        contentRef,
        authRef,
        handleIsShowAlert,
        handleIsMenuToggle
    } = useApiUIHooks()
    const {data: session} = useSession()


    useUIHooks({
        onCallRequest: callApiRequest,
        canSend: !!id
    });


    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">

            <div style={{flex: '23.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>

                <div className="border-b border-zinc-800 min-h-10 px-4 flex items-center">
                    <h4 className="text-md">API</h4>
                    <div className="flex flex-1 justify-end">
                        <LuPencilLine onClick={() => setShowTrash(!showTrash)}
                                      className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-300"/>
                    </div>
                </div>

                {activeMenu === 'api' ? (
                    <div className="flex flex-col text-sm overflow-hidden border-zinc-800 mb-2">
                        {apisIsLoading && (
                            <div className="flex flex-col">
                                {[...Array(20)].map((_, i) => <SkeletonComponent key={i}/>)}
                            </div>
                        )}
                        {apis && apis.map((data, key) => (
                            <div key={key}
                                 className="flex group items-center cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 p-3.5 py-1.5 gap-2 text-md w-full">
                                <div className="flex-shrink-0">
                                    <IoLogoChrome className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                </div>

                                <div className="relative flex-1 min-w-0 group/text">
                                    <div className="text-zinc-300 group-hover:text-white truncate">
                                        {data.name}
                                    </div>

                                    <ToolTipComponent data={data.name} isFirst={key === 0}/>
                                </div>

                                {showTrash && (
                                    <>
                                        <div onClick={async (e) => {
                                            setId(data.id)
                                            setSelectedName(data.name)
                                            setEditModalOpen(true)
                                        }} className="flex-shrink-0 flex justify-end">
                                            <MdModeEditOutline className="h-4 w-4 text-gray-400 group-hover:text-gray-300"/>
                                        </div>
                                        {data.is_deletable && (
                                            <div onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick();
                                            }} className="flex-shrink-0 flex justify-end">
                                                <CiTrash className="h-4 w-4 fill-rose-400 group-hover:fill-red-500"/>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col text-sm overflow-hidden border-zinc-800 mb-2">
                            {historiesLoading && (
                                <div className="flex flex-col">
                                    {[...Array(20)].map((_, i) => <SkeletonComponent key={i}/>)}
                                </div>
                            )}
                            {histories && histories.map((data, key) => (
                                <div key={key} onClick={() => setId(data.api_request_id)}
                                     className="flex group items-center cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 p-3.5 py-1.5 gap-2 text-md w-full">
                                    <div className="flex-shrink-0">
                                        <IoLogoChrome className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                    </div>

                                    <div className="relative flex-1 min-w-0 group/text">
                                        <div className="text-zinc-300 group-hover:text-white truncate">
                                            {data.url}
                                        </div>

                                        <ToolTipComponent data={data.url} isFirst={key === 0}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`${isMenuToggle ? 'border-r max-w-10' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 !bg-[#171717] z-10 box-content overflow-hidden text-sm`}>
                <div title="API 목록" onClick={() => setActiveMenu('api')} className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons text-zinc-200 hover:text-zinc-400">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                </div>
                <div title="API 히스토리 목록" onClick={() => setActiveMenu('history')} className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons text-zinc-200 hover:text-zinc-400">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                           strokeWidth="2">
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </g>
                    </svg>
                </div>
                {/*<div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">*/}
                {/*    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">*/}
                {/*        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
                {/*           strokeWidth="2">*/}
                {/*            <path*/}
                {/*                d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>*/}
                {/*            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>*/}
                {/*            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>*/}
                {/*        </g>*/}
                {/*    </svg>*/}
                {/*</div>*/}
                {/*<div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">*/}
                {/*    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">*/}
                {/*        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"*/}
                {/*              strokeWidth="2" d="m16 18l6-6l-6-6M8 6l-6 6l6 6"></path>*/}
                {/*    </svg>*/}
                {/*</div>*/}


            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="해당 API를 삭제하시겠습니까?"
                message="삭제된 API는 복구가 불가능 합니다."
                onCancel={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    await deleteApiRequest(id);
                }}
            />

            <DarkModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedId(null)
                    setSelectedName(null)
                }}
                updateField={async () => {
                    await updateField('name', selectedName, id)
                    setEditModalOpen(false)
                    setAlertMessage('이름이 변경 되었습니다.')
                    handleIsShowAlert()
                }}
                title="API이름 수정"
                selectedId={selectedId}
                selectedName={selectedName}
            >
                <div className="space-y-4">
                    {/*<p className="text-sm text-zinc-500">변경할 이름을 입력해 주세요.</p>*/}
                    {/*<div className="p-4 bg-teal-900/10 border border-teal-900/30 rounded-lg flex gap-3 text-zinc-400/80 text-sm">*/}
                    {/*<span>변경할 이름을 입력해 주세요.</span>*/}
                    {/*</div>*/}
                    <input
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        type="text"
                        placeholder="변경할 이름을 입력해 주세요"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-white outline-none focus:border-zinc-600 transition-colors"
                    />
                </div>
            </DarkModal>

            <div style={{flex: '70.5 1 0px'}} className="flex flex-col overflow-hidden">
                {/*컨텐츠*/}
                {/*테이블 선택 리스트*/}
                <div className="border-b border-zinc-800 min-h-10 flex">
                    {/*메뉴 접기*/}
                    <div onClick={handleIsMenuToggle}
                         className={`${isMenuToggle ? 'rotate-0 border-r' : 'rotate-180 border-l'} border-zinc-800 flex items-center px-2 hover:bg-zinc-800`}>
                        <TbLayoutSidebarLeftCollapse
                            className="h-6 w-6 fill-transparent stroke-zinc-600 cursor-pointer"/>
                    </div>

                    {/*테이블 탭*/}
                    {apis && apis.map((data, key) => (
                        <ApiRequestComponent onDelete={async () => {
                            await deleteApiRequest(data.id)
                        }} onGet={async () => {
                            setId(data.id)
                        }} isDeletable={data.is_deletable} isActive={id === data.id} key={key} name={data.name}
                                             method={data.method}/>
                    ))}


                    <div onClick={() => createApiRequest()}
                         className="cursor-pointer flex items-center px-3 hover:bg-zinc-700">
                        <div><GoPlus className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                    </div>

                </div>

                <div className="text-[12px] min-h-[420px]  border-b border-zinc-800 flex flex-1 flex-col">
                    {/*요청입력*/}
                    <div className="flex text-[12px] rounded p-2">
                        <div ref={httpMethodRef}
                             onClick={() => setDropdowns(prev => ({...prev, httpMethod: !dropdowns.httpMethod}))}
                             className="flex rounded-l relative items-center border border-r-0  text-green-400 cursor-pointer !bg-[#1c1c1e] border-zinc-800 py-1.5 px-5 pl-3 outline-none space-x-5">
                            <div className={`font-bold ${requestData.method
                                ? methodColorMap[requestData.method] ?? "text-zinc-400"
                                : "text-zinc-400"}`}>{requestData.method}</div>
                            {dropdowns.httpMethod &&
                                <HttpMethodDropdown updateField={updateField} dropdowns={dropdowns}
                                                    setDropdowns={setDropdowns}/>}
                            <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                        </div>

                        <input value={requestData.url || ""} onChange={(e) => updateField('url', e.target.value)}
                               className="pl-1 rounded-r outline-none border-l-0 flex flex-1 border border-zinc-800 !bg-[#1c1c1e] pr-12"
                               type="text"/>

                        <button type="button" onClick={() => callApiRequest()}
                                className="rounded bg-indigo-500 cursor-pointer hover:bg-indigo-400 px-4 py-1 ml-2">전송
                        </button>

                        {/*<button type="button" onClick={handleIsShowAlert} disabled={isShowAlert}*/}
                        {/*        className={`rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 px-4 py-1 ml-2 flex items-center border border-zinc-800 space-x-1 ${isShowAlert ? 'cursor-not-allowed' : 'cursor-pointer'}`}>*/}
                        {/*    <div><IoIosSave className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>*/}
                        {/*    <div className={`font-bold`}>저장</div>*/}
                        {/*</button>*/}
                    </div>

                    <div className="flex space-x-6 text-[12px] p-2">
                        {tabs.map((tab, key) => (
                            <div onClick={() => setActiveTab(tab)} key={key}
                                 className="font-bold cursor-pointer relative">
                                <div className={`${activeTab == tab ? 'tab active' : 'tab'}`}>{tab}</div>
                            </div>
                        ))}
                    </div>

                    {activeTab === '파라미터' && (
                        <>
                            <div className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold">
                                <div>쿼리 파라미터 목록</div>
                                <div className="flex flex-1 justify-end space-x-3 mr-1">
                                    <div className="cursor-pointer"><FaPlus onClick={() => addDict('params')}
                                                                            className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/>
                                    </div>
                                </div>
                            </div>
                            {requestData && requestData.params.map((data, key) => (
                                <QueryParameterComponent key={key} index={key} deleteDict={deleteDict}
                                                         updateDict={updateDict} data={data} field="params"/>
                            ))}
                        </>
                    )}

                    {activeTab === '본문' && (
                        <>
                            <div
                                className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold space-x-3 items-center">
                                <div>컨텐츠 종류</div>
                                <div ref={contentRef}
                                     onClick={() => setDropdowns(prev => ({...prev, content: !dropdowns.content}))}
                                     className="flex space-x-1 items-center mb-0.5 cursor-pointer relative hover:text-zinc-300">
                                    <div>{requestData.body_type}</div>
                                    <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/>
                                    </div>
                                    <ContentTypeDropdown dropdowns={dropdowns} setDropdowns={setDropdowns}
                                                         updateField={updateField} selected={requestData!.body_type!}/>
                                </div>
                            </div>
                            {requestData && requestData.body_type === 'application/json' ? (
                                <CodeEditor body_content={requestData!.body_content!} updateField={updateField}/>
                            ) : requestData && requestData.body_type === 'multipart/form-data' ? (
                                <div className="flex">
                                    <input type="text" placeholder="키"
                                           className="outline-none basis-9/27 border-r py-2 px-3 border-b border-zinc-800"/>
                                    <input type="text" placeholder="값" value={file ? file.name : ''}
                                           className="outline-none basis-9/27 border-r py-2 px-3 border-b border-zinc-800"/>
                                    <div
                                        type="button"
                                        onClick={handleButtonClick}
                                        className="relative group flex items-center  outline-none basis-9/27 border-r py-2 px-3 border-b border-zinc-800 cursor-pointer"
                                    >
                                        <div
                                            className="bg-zinc-800 py-0.5 px-2 mr-1 !text-[11px] text-zinc-400 rounded-sm font-bold bg-zinc-900 group-hover:bg-zinc-800">파일선택
                                        </div>
                                        <div
                                            className="text-[11px] text-zinc-400 font-bold group-hover:text-zinc-500">{file ? file.name : '파일이 선택되지 않았습니다.'}</div>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => handleFileOnChange(e)}
                                        style={{display: 'none'}}
                                        accept="image/*, video/*"
                                    />

                                </div>
                            ) : (
                                <div></div>
                            )}
                        </>
                    )}

                    {activeTab === '헤더' && (
                        <>
                            <div className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold">
                                <div>헤더 목록</div>
                                <div className="flex flex-1 justify-end space-x-3 mr-1">
                                    <div className="cursor-pointer"><FaPlus onClick={() => addDict('headers')}
                                                                            className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/>
                                    </div>
                                </div>
                            </div>
                            {requestData && requestData.headers.map((data, key) => (
                                <QueryParameterComponent key={key} index={key} deleteDict={deleteDict}
                                                         updateDict={updateDict} data={data} field="headers"/>
                            ))}
                        </>
                    )}

                    {activeTab === '인증' && (
                        <>
                            <div ref={authRef}
                                 className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold space-x-3 items-center">
                                <div>인증유형</div>
                                <div onClick={() => setDropdowns(prev => ({...prev, auth: !dropdowns.auth}))}
                                     className="flex space-x-1 items-center mb-0.5 cursor-pointer relative hover:text-zinc-300">
                                    <div>{requestData.auth_type}</div>
                                    <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/>
                                    </div>
                                    <AuthTypeDropdown dropdowns={dropdowns} setDropdowns={setDropdowns}
                                                      updateField={updateField} selected={requestData!.auth_type!}/>
                                </div>
                            </div>
                            {requestData && requestData.auth_type === 'Bearer' ? (
                                <div>
                                    <div className="flex flex-1">
                                        <div
                                            className="outline-none basis-1/8 border-r py-2 px-3 border-b border-zinc-800">토큰
                                        </div>
                                        <input type="text" value={requestData && requestData?.auth_content?.token}
                                               placeholder={`Bearer 토큰을 입력해 주세요.`}
                                               onChange={(e) => updateField('auth_content', e.target.value)}
                                               className="outline-none basis-7/8 border-r py-2 px-3 border-b border-zinc-800"/>
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )
                            }
                        </>
                    )}
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="border-b border-zinc-800 text-sm divide-x divide-zinc-800 p-2">
                        <div className="flex space-x-2 text-[11px]">
                            <div className="text-zinc-400">상태: <span
                                className="text-green-400">{historyData.status_code}</span></div>
                            <div className="text-zinc-400">시간: <span
                                className="text-green-400">{historyData.duration_ms} ms</span></div>
                            <div className="text-zinc-400">크기: <span
                                className="text-green-400">{historyData.response_size}</span></div>
                        </div>

                        <div className="flex space-x-7 text-[12px] mt-4 flex-1">
                            <div className="font-bold cursor-pointer relative">
                                <div className="tab active">JSON</div>
                            </div>
                            <div className="hover:font-bold cursor-pointer relative">
                                <div className="tab">헤더</div>
                            </div>
                            <div className="hover:font-bold cursor-pointer relative">
                                <div className="tab">테스트결과</div>
                            </div>
                        </div>
                    </div>
                    <div className="border-zinc-800 border-b p-2 text-sm text-zinc-400 text-[11px] font-bold">
                        응답 본문
                    </div>

                    <div className="overflow-auto flex flex-1">
                        {callMutating ? (<SpinnerComponent/>) : errorMessage ? (<div
                            className="px-1.5 py-1.5 text-sm text-zinc-300">{errorMessage}</div>) : historyData?.response_body && (
                            <JsonEditor value={pretty}/>)}
                    </div>
                </div>

            </div>


            {isShowAlert &&
                <div className="absolute right-6 bottom-6">
                    <div className="bg-green-400 px-4 py-1.5 rounded-md text-white font-bold text-sm">
                        {alertMessage}
                    </div>
                </div>
            }
        </div>
    )
}
