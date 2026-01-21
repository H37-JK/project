import {BsFiletypeSql} from "react-icons/bs";
import {IoSearchOutline} from "react-icons/io5";
import {CiViewTable} from "react-icons/ci";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import {HiX} from "react-icons/hi";
import {GoPlus} from "react-icons/go";
import {CiFilter} from "react-icons/ci";
import {MdFormatListBulleted} from "react-icons/md";
import {BsSend} from "react-icons/bs";
import {LuRefreshCw} from "react-icons/lu";
import {ImSpinner2} from "react-icons/im";
import {useState} from "react";
import CustomCheckBox from "@/components/checkbox/CustomCheckBox";
import TableColumnData from "@/api/table/TableColumnData";
import TableColumnComponent from "@/components/table/TableColumnComponent";
import TableValueData from "@/api/table/TableValueData";
import TableValueComponent from "@/components/table/TableValueComponent";
import SnippetData from "@/api/sql/SnippetData";
import SnippetComponent from "@/components/sql/SnippetComponent";
import {MdTextSnippet} from "react-icons/md";
import CodeEditor from "@/components/editor/CodeEditor";
import {IoIosArrowDown} from "react-icons/io";
import ApiRequestData from "@/api/api-request/ApiRequestData";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FaPlus} from "react-icons/fa6";
import JsonEditor from "@/components/editor/JsonEditor";
import { IoIosSave } from "react-icons/io";

export default function Home() {

    const [isShowAlert, setIsShowAlert] = useState(false)
    const [isMenuToggle, setIsMenuToggle] = useState(true)

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 1500)

    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
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
            <div style={{flex: '29.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-12 px-6 flex items-center">
                    <h4 className="text-lg">모음집</h4>
                </div>
                {/*테이블 검색*/}
                <div className="p-3 border-b border-zinc-800">
                    <div className="relative">
                        <IoSearchOutline
                            className="h-3 w-3 fill-transparentstroke-zinc-500 cursor-pointer absolute top-2 left-2"/>
                        <input placeholder="API를 검색해 주세요." type="text"
                               className="h-[26px] cursor-pointer text-xs px-2.5 pl-7 py-1 border outline-none border-zinc-800 rounded-md w-full focus:border-zinc-700"/>
                    </div>
                </div>

                {/*스니펫 리스트*/}
                <div className="flex flex-col text-sm overflow-auto border-b border-zinc-800 mb-2">
                    <h4 className="text-md py-1.5 p-4 text-zinc-400">요청모음 (2)</h4>
                    {ApiRequestData().map((data, key) => (
                        <SnippetComponent name={data.name} key={key}/>
                    ))}
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
                    <div className="border-r border-zinc-800 group cursor-pointer hover:opacity-90 hover:bg-zinc-800">
                        <div
                            className="text-xs gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex ">
                                <div className="text-green-400">GET</div>
                                <div className="group-hover:text-white">아이템조회</div>
                            </div>
                            <div className="invisible group-hover:visible"><HiX
                                className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>

                    <div className="border-r border-zinc-800 group cursor-pointer hover:opacity-90 hover:bg-zinc-800">
                        <div
                            className="text-xs gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex">
                                <div className="text-green-400">GET</div>
                                <div className="group-hover:text-white">아이템조회</div>
                            </div>
                            <div className="invisible group-hover:visible"><HiX
                                className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>

                    <div className="border-r border-zinc-800 group cursor-pointer hover:opacity-90 hover:bg-zinc-800">
                        <div
                            className="text-xs gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex">
                                <div className="text-green-400">GET</div>
                                <div className="group-hover:text-white">아이템조회</div>
                            </div>
                            <div className="invisible group-hover:visible"><HiX
                                className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>


                    <div className="cursor-pointer flex items-center px-3 hover:bg-zinc-700">
                        <div><GoPlus className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                    </div>

                </div>

                <div className="text-[12px] min-h-[420px] border-b border-zinc-800">
                    {/*요청입력*/}
                    <div className="flex text-[12px] rounded p-2">
                        <div
                            className="flex rounded-l items-center border border-r-0  text-green-400 cursor-pointer !bg-[#1c1c1e] border-zinc-800 py-1.5 px-5 pl-3 outline-none space-x-5">
                            <div>GET</div>
                            <div><IoIosArrowDown className="h-3 w-3 fill-gray-400 group-hover:fill-white"/></div>
                        </div>

                        <input
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
