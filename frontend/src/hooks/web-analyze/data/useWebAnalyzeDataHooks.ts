import {useState} from "react";
import {WebAnalyze} from "@/constants/web-analyze";
import useSWR from "swr";
import {ApiRequest} from "@/constants/api";
import {getFetcher, postFetcher} from "@/lib/axios";
import useSWRMutation from "swr/mutation";
import {useWebAnalyzeUiHooks} from "@/hooks/web-analyze/ui/useWebAnalyzeUiHooks";


const create_web_analyze_url = '/create/web-analyze'
const get_web_analyze_url = '/get/web-analyze'

export function useWebAnalyzeDataHooks() {
    const [id, setId] = useState<string | null>('')
    const [domain, setDomain] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [requestData, setRequestData] = useState<WebAnalyze | null>(null)
    const { data: webCheck, isLoading: webCheckIsLoading, mutate: webCheckMutate  } = useSWR<WebAnalyze>(id ? `${get_web_analyze_url}/${id}` : null, getFetcher)
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false)

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 1500)
    }

    const { trigger: createTrigger, isMutating: createMutating } = useSWRMutation (
        create_web_analyze_url,
        postFetcher, {
            onSuccess: async (data) => {
                await Promise.all([
                    webCheckMutate()
                ]);
                if (data.id) setId(data.id)
            }
        }
    )

    const createWebAnalyzeRequest = async () => {
        try {
            if (!domain) {
                handleIsShowAlert()
                return false
            }

            setIsAnalyzing(true)
            setProgress(0)

            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(timer)
                        return 90
                    }
                    return prev + 5
                })
            }, 300)

            const data = {
                domain
            }
            await createTrigger ({
                data
            })

            clearInterval(timer)
            setProgress(100)

            setTimeout(() => {
                setIsAnalyzing(false)
                setProgress(0)
            }, 500)

        } catch (error) {
            setIsAnalyzing(false);
            setProgress(0);
            console.error(error)
        }
    }

    const formatValue = (value: any) => {
        return Array.isArray(value)
            ? value.join('\n')
            : (typeof value === 'string'
                    ? value.replaceAll(',', '\n')
                    : (typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value))
            );
    }

    return {
        id, setId,
        progress, isAnalyzing,
        domain, setDomain,
        webCheck,
        isShowAlert, handleIsShowAlert,
        createWebAnalyzeRequest, formatValue
    }
}