import { BsFiletypeSql } from "react-icons/bs";
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
import { MdTextSnippet } from "react-icons/md";
import CodeEditor from "@/components/editor/CodeEditor";

export default function Home() {

    const [email, setEmail] = useState('these990703@gmail.com')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isMenuToggle, setIsMenuToggle] = useState(true)

    const handleRefresh = () => {
        setIsRefreshing(true)

        setTimeout(() => {
            setIsRefreshing(false)
        }, 1500)
    }

    const handelIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            <div style={{flex: '29.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-12 px-6 flex items-center">
                    <h4 className="text-lg">쿼리 에디터</h4>
                </div>
                {/*테이블 검색*/}
                <div className="p-3 border-b border-zinc-800">
                    <div className="relative">
                        <IoSearchOutline
                            className="h-3 w-3 fill-transparentstroke-zinc-500 cursor-pointer absolute top-2 left-2"/>
                        <input placeholder="스니펫을 검색해 주세요." type="text"
                               className="h-[26px] cursor-pointer text-xs px-2.5 pl-7 py-1 border outline-none border-zinc-800 rounded-md w-full focus:border-zinc-700"/>
                    </div>
                </div>

                {/*스니펫 리스트*/}
                <div className="flex flex-col text-sm overflow-auto border-b border-zinc-800 mb-2 max-h-[36rem]">
                    <h4 className="text-md py-1.5 p-4 text-zinc-400">스니펫 (4)</h4>
                    {SnippetData().map((data, key) => (
                        <SnippetComponent name={data.name} key={key} />
                    ))}
                </div>

                {/*템플릿 리스트*/}
                <div className="flex flex-col text-sm overflow-auto border-b border-zinc-800 mb-2">
                    <h4 className="text-ms py-1 p-4 text-zinc-400">커뮤니티 (1)</h4>
                    <div
                        className="flex group items-center  cursor-pointer hover:bg-zinc-800 p-4 py-1.5 gap-2 text-md">
                        <div><MdTextSnippet className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                        <div className="text-zinc-300 group-hover:text-white">탬플릿</div>
                    </div>
                </div>

            </div>

            <div style={{flex: '70.5 1 0px'}} className="flex flex-col overflow-hidden">
                {/*컨텐츠*/}
                {/*테이블 선택 리스트*/}
                <div className="border-b border-zinc-800 min-h-10 flex">
                    {/*메뉴 접기*/}
                    <div onClick={handelIsMenuToggle}
                         className={`${isMenuToggle ? 'rotate-0 border-r' : 'rotate-180 border-l'} border-zinc-800 flex items-center px-2 hover:bg-zinc-800`}>
                        <TbLayoutSidebarLeftCollapse
                            className="h-6 w-6 fill-transparent stroke-zinc-600 cursor-pointer"/>
                    </div>

                    {/*테이블 탭*/}
                    <div className="border-r border-zinc-800 group cursor-pointer">
                        <div
                            className="text-xs text-zinc-500 gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex">
                                <div><CiViewTable className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                </div>
                                <div className="group-hover:text-white">storage<span
                                    className="text-zinc-400 group-hover:text-white">.bucket</span></div>
                            </div>
                            <div className="invisible group-hover:visible"><HiX
                                className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>

                    <div className="border-r border-zinc-800 group cursor-pointer">
                        <div
                            className="text-xs text-zinc-500 gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex">
                                <div><CiViewTable className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                </div>
                                <div className="group-hover:text-white">storage<span
                                    className="text-zinc-400 group-hover:text-white">.bucket</span></div>
                            </div>
                            <div className="invisible group-hover:visible">
                                <HiX className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>


                    <div className="border-r border-zinc-800 group cursor-pointer">
                        <div
                            className="text-xs text-zinc-500 gap-2 flex items-center justify-center flex-1 h-full px-2">
                            <div className="gap-1 cursor-pointer flex">
                                <div><CiViewTable className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                </div>
                                <div className="group-hover:text-white">storage<span
                                    className="text-zinc-400 group-hover:text-white">.bucket</span></div>
                            </div>
                            <div className="invisible group-hover:visible"><HiX
                                className="h-3 w-3 fill-zinc-300  group-hover:fill-white"/></div>
                        </div>
                    </div>

                    <div className="cursor-pointer flex items-center px-3 hover:bg-zinc-700">
                        <div><GoPlus className="h-4 w-4 fill-gray-400 group-hover:fill-white"/></div>
                    </div>

                </div>

                <div className="flex flex-1">
                    <CodeEditor />
                </div>

                <div className="min-h-96">
                    <div className="border-b border-zinc-800 flex items-center text-sm divide-x divide-zinc-800">
                        <div className="p-2 py-2 text-xs cursor-pointer text-gray-300 hover:text-gray-100">Result</div>
                        <div className="p-2 py-2 text-xs cursor-pointer text-gray-300 hover:text-gray-100">Result</div>

                        <div className="flex flex-1 justify-end">
                            <div className="border border-zinc-800 rounded-md bg-zinc-600 flex mr-3 text-xs">
                                <div className="px-8 py-1 border-r border-zinc-600 rounded-l-md bg-zinc-700 hover:bg-zinc-600 cursor-pointer">source</div>
                                <div className="px-8 py-1 border-r border-zinc-600 bg-zinc-700 hover:bg-zinc-600 cursor-pointer">postgres</div>
                                <div className="flex flex-1 px-8 py-1 bg-green-900 hover:bg-green-800 rounded-r-md cursor-pointer">
                                    <div>Run</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        {TableColumnData().map((data, key) => (
                            <TableColumnComponent primaryKey={data.primaryKey} name={data.name} type={data.type}/>
                        ))}

                    </div>

                    <div className="flex">
                        {TableValueData().map((data, index) => (
                            <TableValueComponent columnName={data.columnName} value={data.value}/>
                        ))}


                    </div>
                </div>

            </div>
        </div>
    )
}
