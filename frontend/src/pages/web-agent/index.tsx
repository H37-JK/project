"use client";
import React, {useState} from "react";
import {LuPencilLine} from "react-icons/lu";
import {MdSubdirectoryArrowLeft} from "react-icons/md";
import {TbLayoutSidebarLeftCollapse} from "react-icons/tb";
import {useSession} from "next-auth/react";
import useSWR from "swr";
import {createFetcher, deleteFetcher, getFetcher} from '@/lib/axios';
import useSWRMutation from "swr/mutation";
import {Agent} from "@/constants/agent";
import AgentView from "@/components/agent/AgentView";
import {AgentStore} from "@/store/agent/AgentStore";
import {IoLogoChrome} from "react-icons/io5";
import {CiTrash} from "react-icons/ci";
import ConfirmModal from "@/components/modal/ConfirmModal";
import ToolTipComponent from "@/components/tooltip/TooltipComponent";
import SkeletonComponent from "@/components/skeleton/SkeletonComponent";


export default function Home() {
    const {data: session, status} = useSession()
    const [showTrash, setShowTrash] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const {setIsStarted} = AgentStore()

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()

            await createAgent()
        }
    }

    const {data: agents, isLoading, mutate} = useSWR<Agent[]>('/get/agents', getFetcher)

    const {trigger: createTrigger, isMutating: createMutating} = useSWRMutation(
        '/create/agent',
        createFetcher, {
            onSuccess: () => mutate()
        }
    )

    const {trigger: deleteTrigger, isMutating: deleteMutating} = useSWRMutation(
        '/delete/agent',
        deleteFetcher, {
            onSuccess: () => mutate()
        }
    )

    const createAgent = async () => {
        if (!session?.user.accessToken) return
        try {
            const data = {
                prompt
            }
            setPrompt('')
            setIsStarted(true)
            await createTrigger({
                data
            })
        } catch (error) {
            console.error(error)
        }
    }

    const deleteAgent = async (id: string) => {
        try {
            await deleteTrigger(id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };


    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">

            <ConfirmModal
                isOpen={isModalOpen}
                title="해당 에이전트를 삭제하시겠습니까?"
                message="삭제된 에이전트는 복구가 불가능 합니다."
                onCancel={() => setIsModalOpen(false)}
                onConfirm={async () => {
                    if (selectedId) {
                        await deleteAgent(selectedId);
                    }
                }}
            />
            {/*메뉴*/}
            <div style={{flex: '15.5 1 0px'}}
                 className={`${isMenuToggle ? 'min-w-64 max-w-[32rem] border-r' : 'border-0 min-w-0 max-w-0 w-0'} hidden md:flex transition-all duration-150 ease-linear flex-col border-zinc-800 z-10 box-content overflow-hidden`}>
                <div className="border-b border-zinc-800 min-h-10 px-4 flex items-center">
                    <h4 className="text-md">에이전트 목록</h4>
                    <div className="flex flex-1 justify-end">
                        <LuPencilLine onClick={() => setShowTrash(!showTrash)}
                                      className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-300"/>
                    </div>
                </div>

                {/*에이전트 리스트*/}
                <div className="flex flex-col text-sm overflow-auto border-zinc-800 mb-2">
                    {isLoading && (
                        <div className="flex flex-col">
                            {[...Array(20)].map((_, i) => <SkeletonComponent key={i}/>)}
                        </div>
                    )}
                    {agents && agents.map((data, key) => (
                        <div key={key}
                             className="flex group items-center cursor-pointer border-b border-zinc-800 hover:bg-zinc-800 p-3.5 py-1.5 gap-2 text-md w-full">
                            <div className="flex-shrink-0">
                                <IoLogoChrome className="h-4 w-4 fill-gray-400 group-hover:fill-white"/>
                            </div>

                            <div className="relative flex-1 min-w-0 group/text">
                                <div className="text-zinc-300 group-hover:text-white truncate">
                                    {data.prompt}
                                </div>

                                <ToolTipComponent data={data.prompt} isFirst={key === 0}/>
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

            <div style={{flex: '84.5 1 0px'}} className="flex flex-1 flex-col overflow-hidden">
                {/*컨텐츠*/}
                <div className="border-b border-zinc-800 min-h-10 flex">
                    {/*메뉴 접기*/}
                    <div onClick={handleIsMenuToggle}
                         className={`${isMenuToggle ? 'rotate-0 border-r' : 'rotate-180 border-l'} border-zinc-800 flex items-center px-2 hover:bg-zinc-800`}>
                        <TbLayoutSidebarLeftCollapse
                            className="h-6 w-6 fill-transparent stroke-zinc-600 cursor-pointer"/>
                    </div>

                    <div className="flex items-center px-2 fond-bold">웹 에이전트</div>
                </div>
                <div className="p-2 flex flex-1 flex-col relative overflow-hidden"></div>
                <AgentView/>

                <div className="px-8 mb-5 flex items-end flex-1">
                    <div className="flex flex-1 w-full relative items-end">
                        <input value={prompt} onChange={(e => setPrompt(e.target.value))} onKeyDown={handleKeyDown}
                               className="w-full rounded-2xl py-3 px-4 text-zinc-300 bg-[rgb(27,27,27)] opacity-100 outline-none"
                               type="text" placeholder="프롬프트를 입력해 주세요."/>
                        <div className="absolute right-5 top-1.5">
                            <div className="flex items-center">
                                <div className="text-sm flex items-center space-x-3">
                                    <button onClick={() => createAgent()} type="button"
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
    )
}
