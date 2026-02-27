import {IoLogoChrome} from "react-icons/io5";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import {GoPlus} from "react-icons/go";
import React, {useEffect, useRef, useCallback} from "react";
import {IoIosArrowDown} from "react-icons/io";
import {FaPlus} from "react-icons/fa6";
import JsonEditor from "@/components/editor/JsonEditor";
import {IoIosSave} from "react-icons/io";
import {LuPencilLine} from "react-icons/lu";
import {ApiRequestUpdate} from "@/constants/api";
import SkeletonComponent from "@/components/skeleton/SkeletonComponent";
import ToolTipComponent from "@/components/tooltip/TooltipComponent";
import ApiRequestComponent from "@/components/api/api-request/ApiRequestComponent";
import HttpMethodDropdown from "@/components/dropdown/HttpMethodDropdown";
import QueryParameterComponent from "@/components/api/api-request/QueryParameterComponent";
import ContentTypeDropdown from "@/components/dropdown/ContentTypesDropdown";
import CodeEditor from "@/components/editor/CodeEditor";
import SpinnerComponent from "@/components/spinner/SpinnerComponent";
import AuthTypeDropdown from "@/components/dropdown/AuthTypeDropdown";
import {useApiDataHooks} from "@/hooks/api/data/useApiDataHooks";
import {useApiUIHooks, useClickOutside} from "@/hooks/api/ui/useApiUiHooks";

export default function Home() {
    const {id, setId, requestData, setRequestData, historyData, apis, api, apisIsLoading, errorMessage, createApiRequest, deleteApiRequest, callApiRequest, callMutating, updateField, addDict, updateDict, deleteDict, saveTimerRef, latestIdRef, pretty} = useApiDataHooks()
    const {activeTab, setActiveTab, tabs, isShowAlert, setIsShowAlert, showTrash, setShowTrash, dropdowns, setDropdowns, toggleDropdown, isMenuToggle, setIsMenuToggle, httpMethodRef, contentRef, authRef, handleIsShowAlert, handleIsMenuToggle, methodColor} = useApiUIHooks()

    const closeHttpMethod = useCallback(() => {
        setDropdowns(p => ({ ...p, httpMethod: false }));
    }, []);

    const closeContent = useCallback(() => {
        setDropdowns(p => ({ ...p, content: false }));
    }, []);


    const closeAuth = useCallback(() => {
        setDropdowns(p => ({ ...p, auth: false }));
    }, []);

    useClickOutside(httpMethodRef, closeHttpMethod);
    useClickOutside(contentRef, closeContent);
    useClickOutside(authRef, closeAuth);


    // useEffect(() => {
    //     latestRequestDataRef.current = requestData
    // }, [requestData]);

    const handleCtrlEnter = useCallback(async (event: { ctrlKey: any; metaKey: any; key: string; preventDefault: () => void; }) => {
        const currentId = latestIdRef.current;
        if (currentId && (event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            await callApiRequest()
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleCtrlEnter)
        return () => {
            document.removeEventListener('keydown', handleCtrlEnter)
        }
    }, [handleCtrlEnter]);

    useEffect(() => {
        if (api) {
            setRequestData({
                id: api.id,
                name: api.name,
                method: api.method,
                url: api.url,
                headers: api.headers,
                params: api.params,
                body_type: api.body_type,
                body_content: api.body_content,
                auth_type: api.auth_type,
                auth_content: api.auth_content,
                tab_active: api.tab_active,
                update_at: api.update_at,
            })
        }
    }, [api, id, setRequestData]);

    useEffect(() => {
        latestIdRef.current = id;
        if (saveTimerRef.current) {
            window.clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
    }, [id, latestIdRef, saveTimerRef]);

    useEffect(() => {
        if (apis && apis.length > 0 && !id) {
            setId(apis[apis.length - 1].id);
        }
    }, [apis, id, setId]);


    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            <div style={{flex: '23.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-10 px-4 flex items-center">
                    <h4 className="text-md">API 목록</h4>
                    <div className="flex flex-1 justify-end">
                        <LuPencilLine onClick={() => setShowTrash(!showTrash)}
                                      className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-300"/>
                    </div>
                </div>

                {/*스니펫 리스트*/}
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

                            {/*{showTrash && (*/}
                            {/*    <div onClick={(e) => {*/}
                            {/*        e.stopPropagation();*/}
                            {/*        handleDeleteClick(data.id);*/}
                            {/*    }} className="flex-shrink-0 flex justify-end">*/}
                            {/*        <CiTrash className="h-4 w-4 fill-rose-400 group-hover:fill-red-500"/>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={`${isMenuToggle ? 'border-r max-w-10' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 !bg-[#171717] z-10 box-content overflow-hidden text-sm`}>
                <div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                    </svg>
                </div>
                <div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                           strokeWidth="2">
                            <path d="M12 6v6l4 2"></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </g>
                    </svg>
                </div>
                <div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                           strokeWidth="2">
                            <path
                                d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path>
                            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path>
                            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>
                        </g>
                    </svg>
                </div>
                <div className="py-3 !bg-[#171717] hover:bg-zinc-800 cursor-pointer px-2">
                    <svg data-v-73fac596="" viewBox="0 0 24 24" width="1.2em" height="1.2em" className="svg-icons">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              strokeWidth="2" d="m16 18l6-6l-6-6M8 6l-6 6l6 6"></path>
                    </svg>
                </div>


            </div>

            {/*<ConfirmModal*/}
            {/*    isOpen={isModalOpen}*/}
            {/*    title="해당 에이전트를 삭제하시겠습니까?"*/}
            {/*    message="삭제된 에이전트는 복구가 불가능 합니다."*/}
            {/*    onCancel={() => setIsModalOpen(false)}*/}
            {/*    onConfirm={async () => {*/}
            {/*        if (selectedId) {*/}
            {/*            await deleteAgent(selectedId);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*/>*/}

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
                            await deleteApiRequest()
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
                        <div ref={httpMethodRef} onClick={() => setDropdowns(prev => ({...prev, httpMethod: !dropdowns.httpMethod}))}
                             className="flex rounded-l relative items-center border border-r-0  text-green-400 cursor-pointer !bg-[#1c1c1e] border-zinc-800 py-1.5 px-5 pl-3 outline-none space-x-5">
                            <div className={`font-bold ${methodColor}`}>{requestData.method}</div>
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

                        <button type="button" onClick={handleIsShowAlert} disabled={isShowAlert}
                                className={`rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 px-4 py-1 ml-2 flex items-center border border-zinc-800 space-x-1 ${isShowAlert ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div><IoIosSave className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                            <div className={`font-bold`}>저장</div>
                        </button>
                    </div>

                    <div className="flex space-x-6 text-[12px] p-2">
                        {tabs.map((tab, key) => (
                            <div onClick={() => setActiveTab(tab)} key={key}  className="font-bold cursor-pointer relative">
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
                                                                            className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/></div>
                                </div>
                            </div>
                            {requestData && requestData.params.map((data, key) => (
                                <QueryParameterComponent key={key} index={key} deleteDict={deleteDict} updateDict={updateDict} data={data} />
                            ))}
                        </>
                    )}

                    {activeTab === '본문' && (
                        <>
                            <div className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold space-x-3 items-center">
                                <div>컨텐츠 종류</div>
                                <div ref={contentRef}  onClick={() => setDropdowns(prev => ({...prev, content: !dropdowns.content}))} className="flex space-x-1 items-center mb-0.5 cursor-pointer relative hover:text-zinc-300">
                                    <div>{requestData.body_type}</div>
                                    <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                                    <ContentTypeDropdown dropdowns={dropdowns} setDropdowns={setDropdowns} updateField={updateField} selected={requestData!.body_type!}/>
                                </div>
                            </div>
                            <CodeEditor body_content={requestData!.body_content!} updateField={updateField} />
                        </>
                    )}

                    {activeTab === '헤더' && (
                        <>
                            <div className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold">
                                <div>헤더 목록</div>
                                <div className="flex flex-1 justify-end space-x-3 mr-1">
                                    <div className="cursor-pointer"><FaPlus onClick={() => addDict('headers')}
                                                                            className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/></div>
                                </div>
                            </div>
                            {requestData && requestData.headers.map((data, key) => (
                                <QueryParameterComponent key={key} index={key} deleteDict={deleteDict} updateDict={updateDict} data={data} />
                            ))}
                        </>
                    )}

                    {activeTab === '인증' && (
                        <>
                            <div ref={authRef} className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold space-x-3 items-center">
                                <div>인증유형</div>
                                <div onClick={() => setDropdowns(prev => ({...prev, auth: !dropdowns.auth}))} className="flex space-x-1 items-center mb-0.5 cursor-pointer relative hover:text-zinc-300">
                                    <div>{requestData.auth_type}</div>
                                    <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                                    <AuthTypeDropdown dropdowns={dropdowns} setDropdowns={setDropdowns} updateField={updateField} selected={requestData!.auth_type!}/>
                                </div>
                            </div>
                            {requestData && requestData.auth_type === 'Bearer' ? (
                                <div>
                                    <div className="flex flex-1">
                                        <div className="outline-none basis-1/8 border-r py-2 px-3 border-b border-zinc-800">토큰</div>
                                        <input type="text" placeholder={`Bearer 토큰을 입력해 주세요.`} onChange={(e) => updateField('auth_content', e.target.value)}
                                               className="outline-none basis-7/8 border-r py-2 px-3 border-b border-zinc-800"/>
                                    </div>
                                </div>
                            ) : (
                                <div>test2</div>
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
                        {callMutating ? (<SpinnerComponent/>) : errorMessage ? (<div className="px-1.5 py-1.5 text-sm text-zinc-300">{errorMessage}</div>) : historyData?.response_body && (<JsonEditor value={pretty}/>)}
                    </div>
                </div>

            </div>

            {isShowAlert &&
                <div className="absolute right-6 bottom-6">
                    <div className="bg-green-400 w-32 px-4 py-1.5 rounded-md text-white font-bold text-sm">저장 되었습니다.
                    </div>
                </div>
            }
        </div>
    )
}
