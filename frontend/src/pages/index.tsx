import {LuArrowDownUp} from "react-icons/lu";
import {IoSearchOutline} from "react-icons/io5";
import {CiViewTable} from "react-icons/ci";
import TableData from "@/api/table/TableData";
import TableComponent from "@/components/table/TableComponent";
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
                        <h4 className="text-lg">테이블 에디터</h4>
                    </div>
                    {/*스키마 검색*/}
                    <div className="p-5 pb-3">
                        <button type="button"
                                className="flex items-center cursor-pointer border hover:bg-selection border-zinc-800 rounded-md w-full h-[26px] text-xs px-2.5 py-1 transition-all duration-200 ease-out outline-none outline-0 focus-visible:outline-4 focus-visible:outline-offset-1">
                            <div className="w-full flex gap-1">
                                <p className="text-zinc-500">schema</p>
                                <p className="text-foreground">user</p>
                            </div>
                            <div>
                                <LuArrowDownUp
                                    className="h-3 w-3 fill-transparent stroke-zinc-500 cursor-pointer"/>
                            </div>
                        </button>
                    </div>
                    {/*테이블 검색*/}
                    <div className="p-5 pt-0 pb-3">
                        <div className="relative">
                            <IoSearchOutline
                                className="h-3 w-3 fill-transparentstroke-zinc-500 cursor-pointer absolute top-2 left-2"/>
                            <input placeholder="테이블을 검색해 주세요." type="text"
                                   className="h-[26px] cursor-pointer text-xs px-2.5 pl-7 py-1 border outline-none border-zinc-800 rounded-md w-full focus:border-zinc-700"/>
                        </div>
                    </div>
                    {/*테이블 리스트*/}
                    <div className="pt-1 flex flex-col flex-1 text-sm overflow-auto">
                        {TableData().map((data, index) => (
                            <TableComponent name={data.name} key={index}/>
                        ))}
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

                    {/*필터*/}
                    <div
                        className="bg-[#1f1f1f] border-b border-zinc-800 min-h-8 text-sm text-zinc-500 flex items-center p-2">
                        <div className="flex gap-1">
                            <div
                                className="flex items-center gap-1 px-2 text-gray-300 text-xs cursor-pointer py-1.5 rounded hover:bg-zinc-800">
                                <div><CiFilter className="h-3.5 w-3.5 fill-gray-300  group-hover:fill-white"/>
                                </div>
                                <div>필터</div>
                            </div>
                            <div
                                className="flex items-center gap-1 px-2 text-gray-300 text-xs cursor-pointer py-1.5 rounded hover:bg-zinc-800">
                                <div><MdFormatListBulleted
                                    className="h-3.5 w-3.5 fill-gray-300  group-hover:fill-white"/></div>
                                <div>정렬</div>
                            </div>
                        </div>

                        {/*실시간, 새로 고침*/}
                        <div className="flex flex-1 justify-end gap-2">
                            <div
                                className="border border-zinc-800 rounded-md text-zinc-200 flex items-center px-3 py-1 text-xs gap-1.5 cursor-pointer">
                                <div className="text-zinc-500">
                                    <BsSend className="h-3 w-3 fill-zinc-500  group-hover:fill-white"/>
                                </div>
                                <div>실시간 기능</div>
                            </div>
                            <div onClick={handleRefresh}
                                 className={`border border-zinc-800 flex items-center justify-center rounded px-2 py-2 ${isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                {!isRefreshing ?
                                    <LuRefreshCw className="h-3.5 w-3.5"/> :
                                    <ImSpinner2 className="h-3.5 w-3.5 animate-spin"/>}
                            </div>
                        </div>
                    </div>

                    {/*컬럼, 컬럼 값*/}
                    <div className="flex flex-1 overflow-auto flex-col">

                        <div className="flex">
                            <div className="bg-[#1f1f1f] border-b border-zinc-800 min-h-10 flex text-white min-w-10">
                                <div className="p-2 px-3 border-r border-zinc-800 flex items-center min-h-full">
                                    <CustomCheckBox id="c"/>
                                </div>
                            </div>

                            {TableColumnData().map((data, key) => (
                                <TableColumnComponent primaryKey={data.primaryKey} name={data.name} type={data.type}/>
                            ))}

                            <div className="flex">
                                <div
                                    className="flex items-center min-h-10 justify-center bg-[#1f1f1f] p-2 px-3 border-r text-xs gap-2 border-zinc-800 border-b min-w-48 cursor-pointer hover:bg-zinc-700">
                                    <GoPlus className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="border-b border-zinc-800 min-h-9 text-white flex">
                                <div className="p-2 px-3 border-r border-zinc-800 flex items-center">
                                    <CustomCheckBox id="cv-1"/>
                                </div>
                            </div>

                            {TableValueData().map((data, index) => (
                                <TableValueComponent columnName={data.columnName} value={data.value}/>
                            ))}

                            <div tabIndex={0}
                                 className="border-b border-zinc-800 min-h-9 text-white flex p-2 border-r items-center text-xs min-w-48 focus:ring-1 focus:ring-sky-400 cursor-pointer">
                            </div>
                        </div>




                    </div>
                </div>
        </div>
    )
}
