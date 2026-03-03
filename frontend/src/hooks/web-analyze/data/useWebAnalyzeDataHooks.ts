import {useState} from "react";
import {WebAnalyze} from "@/constants/web-analyze";
import useSWR from "swr";
import {getFetcher, postFetcher} from "@/lib/axios";
import useSWRMutation from "swr/mutation";
import axios from "axios";


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
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
                setErrorMessage('주소를 입력해 주세요.')
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
            handleIsShowAlert()
            setIsAnalyzing(false);
            setProgress(0);
            if (axios.isAxiosError(error)) {
                const message = error?.response?.data.detail
                setErrorMessage(message)

                if (Array.isArray(errorMessage)) {
                    console.log("유효성 검사 에러:", errorMessage[0].msg);
                }
            } else {
                console.error("일반 에러:", error);
            }
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
        errorMessage,
        webCheck,
        isShowAlert, handleIsShowAlert,
        createWebAnalyzeRequest, formatValue
    }
}