import {IoLogoChrome} from "react-icons/io5";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import {GoPlus} from "react-icons/go";
import React, {useEffect, useRef, useState} from "react";
import {IoIosArrowDown} from "react-icons/io";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FaPlus} from "react-icons/fa6";
import JsonEditor from "@/components/editor/JsonEditor";
import { IoIosSave } from "react-icons/io";
import {LuPencilLine} from "react-icons/lu";
import {useSession} from "next-auth/react";
import {createFetcher, deleteFetcher, getFetcher, updateFetcher} from "@/lib/axios";
import useSWR from "swr";
import {ApiRequest, ApiRequestUpdate} from "@/constants/api";
import useSWRMutation from "swr/mutation";
import SkeletonComponent from "@/components/skeleton/SkeletonComponent";
import ToolTipComponent from "@/components/tooltip/TooltipComponent";
import {CiTrash} from "react-icons/ci";
import ApiRequestComponent from "@/components/api/api-request/ApiRequestComponent";
import { useSWRConfig } from 'swr';
import HttpMethodDropdown from "@/components/dropdown/HttpMethodDropdown";

export default function Home() {
    const {data: session, status} = useSession()
    const { mutate: globalMutate } = useSWRConfig();
    const saveTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
    const latestIdRef = useRef<string | null>(null);
    const [id, setId] = useState<string | null>(null)
    const [isHttpMethodOpen, setIsHttpMethodOpen] = useState<boolean>(false)
    const [selectedHttpMethod, setSelectedHttpMethod] = useState<string | null>('GET')

    const [requestData, setRequestData] = useState<ApiRequestUpdate>({
        id: null,
        name: null,
        method: null,
        url: null,
        headers: [],
        params: [],
        body_type: null,
        body_content: null,
        auth_type: null,
        auth_content: null,
        tab_active: false,
        update_at: null,
    })

    const [isShowAlert, setIsShowAlert] = useState(false)
    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [showTrash, setShowTrash] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 1500)

    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const {data: apis, isLoading: apisIsLoading, mutate: apisMutate} = useSWR<ApiRequest[]>('/get/tab-active-api-requests', getFetcher)

    const apiKey = id ? `/get/api-request/${id}` : null;
    const {data: api, isLoading: apiIsLoading, mutate: apiMutate} = useSWR<ApiRequest>(id ? `/get/api-request/${id}`: null, getFetcher)

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
    }, [api, id]);

    useEffect(() => {
        latestIdRef.current = id;

        if (saveTimerRef.current) {
            window.clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
    }, [id]);

    useEffect(() => {
        return () => {
            if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
        };
    }, []);

    const {trigger: createTrigger, isMutating: createMutating} = useSWRMutation (
        '/create/api-request',
        createFetcher, {
            onSuccess: async () => {
                await Promise.all([
                    apisMutate(),
                    apiMutate()
                ]);
            }
        }
    )

    const {trigger: updateTrigger, isMutating: updateMutating} = useSWRMutation (
        '/update/api-request',
        updateFetcher, {
            onSuccess: async () => {
                await Promise.all([
                    apisMutate(),
                    apiKey ? globalMutate(apiKey) : Promise.resolve()
                ]);
            }
        }
    )

    const {trigger: deleteTrigger, isMutating: deleteMutating} = useSWRMutation (
        '/delete/api-request',
        deleteFetcher, {
            onSuccess: () => apisMutate()
        }
    )

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const createApiRequest = async () => {
        try {
            const data = {

            }
            await createTrigger({
                data
            })
        } catch(error) {
            console.error(error)
        }
    }

    const deleteApiRequest = async(id: string) => {
        try {
            await deleteTrigger(id)
        } catch (error) {
            console.log(error)
        }
    }

    const persistUpdate = (targetId: string, newData: ApiRequestUpdate) => {
        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

        // @ts-ignore
        saveTimerRef.current = window.setTimeout(async () => {
            if (latestIdRef.current !== targetId) return;

            try {
                const targetKey = `/get/api-request/${targetId}`;

                await globalMutate (
                    targetKey,
                    (prev: ApiRequest | undefined) => {
                        if (!prev) return prev as any;
                        return { ...prev, ...(newData as any) };
                    },
                    { revalidate: false }
                );

                await updateTrigger({
                    id: targetId,
                    data: newData
                });

            } catch (error) {
                await globalMutate(`/get/api-request/${targetId}`);
                console.error(error);
            }
        }, 100);
    };

    const updateField = async (key: keyof ApiRequest, value: any) => {
        const newData = {
            ...requestData,
            [key]: value
        }
        setRequestData(newData)
        if (id) persistUpdate(id, newData);
    }





    const jsonString = '{\n' +
        '  "method": "GET",\n' +
        '  "args": {},\n' +
        '  "data": "",\n' +
        '  "headers": {\n' +
        '    "accept": "*/*,image/webp",\n' +
        '    "accept-encoding": "br",\n' +
        '    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",\n' +
        '    "cdn-loop": "netlify",\n' +
        '    "content-type": "application/json",\n' +
        '    "cookie": "crisp-client%2Fsession%2F3ad30257-c192-4773-955d-fb05a4b41af3=session_c72a4eeb-2b40-48c6-acc4-5071827d2915; ph_phc_yMXTtyuShpN6sOLjLELQ8gtgJbz4kfFRMjVAHtW7IM_posthog=%7B%22distinct_id%22%3A%22019a9081-352b-70d6-a84b-bb752c4b7dfb%22%2C%22%24sesid%22%3A%5B1763363265117%2C%22019a90a4-1a5d-7f45-bfea-5e43a4650e3b%22%2C1763363265117%5D%2C%22%24epp%22%3Atrue%7D",\n' +
        '    "host": "echo.hoppscotch.io",\n' +
        '    "netlify-agent-category": "browser",\n' +
        '    "netlify-invocation-source": "client",\n' +
        '    "priority": "u=1, i",\n' +
        '    "sec-fetch-dest": "empty",\n' +
        '    "sec-fetch-mode": "cors",\n' +
        '    "sec-fetch-site": "none",\n' +
        '    "sec-fetch-storage-access": "active",\n' +
        '    "traceparent": "00-019a90a41a75797ac3fcf02fe6b96c04-7aa0f6c461683082-01",\n' +
        '    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",\n' +
        '    "x-country": "KR",\n' +
        '    "x-forwarded-for": "1.236.98.18, 54.179.27.54",\n' +
        '    "x-forwarded-proto": "https",\n' +
        '    "x-language": "ko-KR",\n' +
        '    "x-nf-account-id": "5e2b91527eb7a24fb0054390",\n' +
        '    "x-nf-account-tier": "account_type_pro",\n' +
        '    "x-nf-client-connection-ip": "1.236.98.18",\n' +
        '    "x-nf-deploy-context": "production",\n' +
        '    "x-nf-deploy-id": "626b1bc6a7f6c1000902602e",\n' +
        '    "x-nf-deploy-published": "1",\n' +
        '    "x-nf-geo": "eyJjaXR5IjoiR295YW5nLXNpIiwiY291bnRyeSI6eyJjb2RlIjoiS1IiLCJuYW1lIjoiU291dGggS29yZWEifSwicG9zdGFsX2NvZGUiOiIxMDMiLCJzdWJkaXZpc2lvbiI6eyJjb2RlIjoiNDEiLCJuYW1lIjoiR3llb25nZ2ktZG8ifSwidGltZXpvbmUiOiJBc2lhL1Nlb3VsIiwibGF0aXR1ZGUiOjM3LjY3OTIsImxvbmdpdHVkZSI6MTI2LjgxODN9",\n' +
        '    "x-nf-request-id": "01KA8A86KNF5XC7Z7G5ZKBJV04",\n' +
        '    "x-nf-request-start": "1763363265480127686",\n' +
        '    "x-nf-site-id": "5d797a9d-fe11-4582-8837-9986a4673158",\n' +
        '    "x-nf-trace-span-id": "b2f30b8b2259f695"\n' +
        '  },\n' +
        '  "path": "/",\n' +
        '  "isBase64Encoded": false\n' +
        '}'

    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            <div style={{flex: '23.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-10 px-4 flex items-center">
                    <h4 className="text-md">API 목록</h4>
                    <div className="flex flex-1 justify-end">
                        <LuPencilLine onClick={() => setShowTrash(!showTrash)} className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-300"/>
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

                            {showTrash && (
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(data.id);
                                }} className="flex-shrink-0 flex justify-end">
                                    <CiTrash className="h-4 w-4 fill-rose-400 group-hover:fill-red-500"/>
                                </div>
                            )}
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
                        <ApiRequestComponent onDelete={async() => {
                            await deleteApiRequest(data.id)
                        }} onGet={async() => {
                            setId(data.id)
                        }} isActive={id === data.id} key={key} name={data.name} method={data.method} />
                    ))}



                    <div onClick={() => createApiRequest()} className="cursor-pointer flex items-center px-3 hover:bg-zinc-700">
                        <div><GoPlus className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                    </div>

                </div>

                <div className="text-[12px] min-h-[420px] border-b border-zinc-800">
                    {/*요청입력*/}
                    <div className="flex text-[12px] rounded p-2">
                        <div onClick={() => setIsHttpMethodOpen(!isHttpMethodOpen)}
                            className="flex rounded-l relative items-center border border-r-0  text-green-400 cursor-pointer !bg-[#1c1c1e] border-zinc-800 py-1.5 px-5 pl-3 outline-none space-x-5">
                            <div>{requestData.method}</div>
                            {isHttpMethodOpen && <HttpMethodDropdown isHttpMethodOpen={isHttpMethodOpen} setIsHttpMethodOpen={setIsHttpMethodOpen} setSelectedHttpMethod={setSelectedHttpMethod}/>}
                            <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                        </div>

                        <input value={requestData.url || ""} onChange={(e) => updateField('url', e.target.value)}
                            className="pl-1 rounded-r outline-none border-l-0 flex flex-1 border border-zinc-800 !bg-[#1c1c1e] pr-12"
                            type="text"/>

                        <button type="button"
                                className="rounded bg-blue-700 cursor-pointer hover:bg-blue-600 px-4 py-1 ml-2">보내기
                        </button>

                        <button type="button" onClick={handleIsShowAlert} disabled={isShowAlert}
                                className={`rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 px-4 py-1 ml-2 flex items-center border border-zinc-800 space-x-1 ${isShowAlert ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div><IoIosSave  className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                            <div className={`font-bold`}>저장</div>
                        </button>
                    </div>

                    <div className="flex space-x-6 text-[12px] p-2">
                        <div className="font-bold cursor-pointer relative">
                            <div className="tab active">파라미터</div>
                        </div>
                        <div className="hover:font-bold cursor-pointer relative">
                            <div className="tab">본문</div>
                        </div>
                        <div className="hover:font-bold cursor-pointer relative">
                            <div className="tab">헤더</div>
                        </div>
                        <div className="hover:font-bold cursor-pointer relative">
                            <div className="tab">파라미터</div>
                        </div>
                        <div className="hover:font-bold cursor-pointer relative">
                            <div className="tab">인증</div>
                        </div>
                        <div className="hover:font-bold cursor-pointer relative">
                            <div className="tab">사전요청 스크립트</div>
                        </div>
                    </div>

                    <div className="flex border-y border-zinc-800 py-1.5 px-2 text-zinc-500 font-bold">
                        <div>쿼리 파라미터 목록</div>
                        <div className="flex flex-1 justify-end">
                            <div className="flex space-x-3 mr-1">
                                <div className="cursor-pointer"><RiDeleteBin6Line
                                    className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/></div>
                                <div className="cursor-pointer"><FaPlus
                                    className="h-3.5 w-3.5 text-gray-300 hover:text-gray-400"/></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1">
                        <div className="flex flex-1">
                            <input type="text" placeholder="키"
                                   className="outline-none basis-1/3 border-r py-2 px-3 border-b border-zinc-800"/>
                            <input type="text" placeholder="값"
                                   className="outline-none basis-1/3 border-r py-2 px-3 border-b border-zinc-800"/>
                            <input type="text" placeholder="설명"
                                   className="outline-none basis-1/3 border-r py-2 px-3 border-b border-zinc-800"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="border-b border-zinc-800 text-sm divide-x divide-zinc-800 p-2">
                        <div className="flex space-x-2 text-[11px]">
                            <div className="text-zinc-400">상태: <span className="text-green-400">200 OK</span></div>
                            <div className="text-zinc-400">시간: <span className="text-green-400">798 ms</span></div>
                            <div className="text-zinc-400">크기: <span className="text-green-400">2.66kb</span></div>
                        </div>

                        <div className="flex space-x-7 text-[12px] mt-4 flex-1">
                            <div className="font-bold cursor-pointer relative">
                                <div className="tab active">JSON</div>
                            </div>
                            <div className="hover:font-bold cursor-pointer relative">
                                <div className="tab">RAW</div>
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
                       <JsonEditor
                           value={jsonString}
                       />
                   </div>


                </div>

            </div>

            {isShowAlert &&
                <div className="absolute right-6 bottom-6">
                    <div className="bg-green-400 w-32 px-4 py-1.5 rounded-md text-white font-bold text-sm">저장 되었습니다.</div>
                </div>
            }
        </div>
    )
}
