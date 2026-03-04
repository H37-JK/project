import useSWR from "swr";
import {Agent} from "@/constants/agent";
import {deleteFetcher, getFetcher, postFetcher} from "@/lib/axios";
import useSWRMutation from "swr/mutation";
import {AgentStore} from "@/store/agent/AgentStore";
import {useSession} from "next-auth/react";
import {useAgentUIHooks} from "@/hooks/agent/ui/useAgentUIHooks";
import {useState} from "react";

const get_agent_url = '/get/agents'
const create_agent_url = '/create/agent'
const delete_agent_url = '/delete/agent'

export function useAgentDataHooks() {
    const {data: agents, isLoading, mutate} = useSWR<Agent[]>(get_agent_url, getFetcher)
    const [prompt, setPrompt] = useState<string>(null)
    const [isShowAlert, setIsShowAlert] = useState<boolean>(null)
    const [alertMessage, setAlertMessage] = useState<stirng>(null)
    const {isStarted, setIsStarted} = AgentStore()
    const {data: session} = useSession()

    const {trigger: createTrigger, isMutating: createMutating} = useSWRMutation(
        create_agent_url,
        postFetcher, {
            onSuccess: () => {
                mutate()
                setIsStarted(false)
            }
        }
    )

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 2000)
    }

    const {trigger: deleteTrigger, isMutating: deleteMutating} = useSWRMutation(
        delete_agent_url,
        deleteFetcher, {
            onSuccess: () => mutate()
        }
    )

    const createAgent = async () => {
        if (isStarted) {
            return false
        }

        if (!prompt) {
            setAlertMessage('프롬프트를 입력해 주세요.')
            handleIsShowAlert()
            return false
        }

        if (!session?.user.accessToken) return
        try {
            const data = {
                prompt
            }
            setIsStarted(true)
            await createTrigger({
                data
            })
            setPrompt('')
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

    return {
        prompt, setPrompt, isShowAlert, alertMessage,
        agents, createAgent, deleteAgent, isLoading
    }

}