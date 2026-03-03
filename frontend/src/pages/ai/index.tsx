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

import {MdTextSnippet} from "react-icons/md";
import CodeEditor from "@/components/editor/CodeEditor";
import {IoIosArrowDown} from "react-icons/io";

import {RiDeleteBin6Line} from "react-icons/ri";
import {FaPlus} from "react-icons/fa6";
import JsonEditor from "@/components/editor/JsonEditor";
import {IoIosSave} from "react-icons/io";
import {AiOutlineEnter} from "react-icons/ai";
import {FaArrowTurnDown} from "react-icons/fa6";
import {FaArrowTurnUp} from "react-icons/fa6";
import {MdSubdirectoryArrowLeft} from "react-icons/md";
import {GoPlusCircle} from "react-icons/go";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';


export default function Home() {

    const [isShowAlert, setIsShowAlert] = useState(false)
    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [aiResponseText, setAiResponseText] = useState(
        `### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`
        ### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`
        ### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\`### 🚀 Hoppscotch란 무엇인가?\n\n**Hppscotch**는 API를 개발하고 테스트하기 위한 **오픈소스** 플랫폼입니다.\n\n- **웹 기반:** 설치가 필요 없습니다.\n- **무료:** 누구나 자유롭게 사용할 수 있습니다.\n- **다양한 프로토콜 지원:**\n  - REST\n  - GraphQL\n  - WebSocket\n\n\`\`\`javascript\n// 예시 코드 블록\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\ngreet('World');\n\`\`\``
    );

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 1500)

    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            {/*메뉴*/}
            <div style={{flex: '29.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-12 px-6 flex items-center">
                    <h4 className="text-lg">플레이그라운드</h4>
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
                    <h4 className="text-md py-1.5 p-4 text-zinc-400">플레이그라운드 (2)</h4>

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

                    <div className="flex items-center px-2 fond-bold">웹 개발</div>

                </div>

                <div className="p-2 flex flex-1 flex-col relative overflow-hidden">

                    <div className="px-8 flex flex-col text-sm max-h-[730px]">
                        <div className="overflow-auto">
                            <div className="text-zinc-400 mb-2">유저</div>
                            <div className="">안녕하세요</div>

                            <div className="text-zinc-400 mb-2 mt-4">모델</div>
                            <div className="markdown-body">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return match ? (
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus as any}
                                                    language={match[1]}
                                                    PreTag="div"
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {aiResponseText}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>


                    <div className="px-8 mt-5">
                        <div className="flex flex-1 w-full relative">
                            <input
                                className="w-full rounded-2xl py-3 px-4 text-zinc-300 bg-[rgb(27,27,27)] opacity-100 outline-none"
                                type="text" placeholder="프롬프트를 입력해 주세요."/>
                            <div className="absolute right-5 top-1.5">
                                <div className="flex items-center">
                                    <div className="text-sm flex items-center space-x-3">
                                        <GoPlusCircle
                                            className="h-5 w-5  cursor-pointer"/>
                                        <button type="button"
                                                className="cursor-pointer rounded-xl bg-zinc-800 opacity-90 px-3 py-2 flex items-center space-x-2">
                                            <div>실행</div>
                                            <div
                                                className="flex items-center text-zinc-400">Ctrl<MdSubdirectoryArrowLeft
                                                className="h-4 w-4  cursor-pointer"/></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
