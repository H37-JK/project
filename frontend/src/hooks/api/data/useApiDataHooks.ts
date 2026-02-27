import axios from 'axios'
import {useRef, useState} from "react"
import {ApiRequest, ApiRequestHistory, ApiRequestUpdate} from "@/constants/api";
import useSWR, {useSWRConfig} from "swr";
import {deleteFetcher, getFetcher, postFetcher, updateFetcher} from "@/lib/axios";
import useSWRMutation from "swr/mutation";
import {formatBytesToHumanReadable} from "@/lib/file";

const DEFAULT_DATA = {
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
}

const DEFAULT_HISTORY = {
    id: null,
    method: null,
    url: null,
    header_sent: null,
    body_sent: null,
    status_code: null,
    duration_ms: null,
    response_size: null,
    response_body: null,
    response_headers: null,
    error_message: null
}

const newDict = {
    'key': '',
    'value': '',
    'desc': '',
    'active': true,
}

const create_api_request_url = '/create/api-request'
const update_api_request_url = '/update/api-request'
const delete_api_request_url = '/delete/api-request'
const call_api_request_url   = '/call/api-request'
const get_tab_active_api_requests_url = '/get/tab-active-api-requests'
const get_api_request_url    = '/get/api-request'

export function useApiDataHooks() {
    const {mutate: globalMutate} = useSWRConfig();
    const [id, setId] = useState<string | null>(null)
    const [requestData, setRequestData] = useState<ApiRequestUpdate>(DEFAULT_DATA)
    const [historyData, setHistoryData] = useState<ApiRequestHistory>(DEFAULT_HISTORY)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const saveTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
    const latestIdRef = useRef<string | null>(null);

    const { data: apis, isLoading: apisIsLoading, mutate: apisMutate } = useSWR<ApiRequest[]>(get_tab_active_api_requests_url, getFetcher)
    const { data: api, isLoading: apiIsLoading, mutate: apiMutate  } = useSWR<ApiRequest>(id ? `${get_api_request_url}/${id}` : null, getFetcher)
    const apiKey = id ? `${get_api_request_url}/${id}` : null;

    const { trigger: createTrigger, isMutating: createMutating } = useSWRMutation (
        create_api_request_url,
        postFetcher, {
            onSuccess: async (data) => {
                await Promise.all([
                    apisMutate(),
                    apiMutate()
                ]);
                if (data.id) setId(data.id)
            }
        }
    )

    const { trigger: updateTrigger, isMutating: updateMutating } = useSWRMutation (
        update_api_request_url,
        updateFetcher, {
            onSuccess: async() => {
                await Promise.all([
                    apisMutate(),
                    apiKey ? globalMutate(apiKey) : Promise.resolve()
                ]);
            }
        }
    )

    const { trigger: deleteTrigger, isMutating: deleteMutating } = useSWRMutation (
        delete_api_request_url,
        deleteFetcher, {
            onSuccess: async () => {
                const updateApis = await apisMutate()
                await apiMutate()

                if (updateApis && updateApis.length > 0) {
                    setId(updateApis[updateApis.length - 1].id)
                }
            }
        }
    )

    const { trigger: callTrigger, isMutating: callMutating } = useSWRMutation (
        call_api_request_url,
        postFetcher, {
            onSuccess: async () => {
                await Promise.all([
                    apisMutate(),
                    apiMutate()
                ]);
            }
        }
    )

    const createApiRequest = async () => {
        try {
            const data = {}
            await createTrigger ({
                data
            })
        } catch (error) {
            console.error(error)
        }
    }

    const deleteApiRequest = async() => {
        if (!id) return
        try {
            await deleteTrigger(id)
        } catch (error) {
            console.error(error)
        }
    }

    const callApiRequest = async() => {
        if (!id) return
        try {
            const data = {
                id,
                url: requestData.url,
                method: requestData.method,
                params: requestData.params,
                headers: requestData.headers,
                body_type: requestData.body_type,
                body_content: requestData.body_content,
                auth_type: requestData.auth_type,
                auth_content: requestData.auth_content,
            }
            const res: ApiRequestHistory = await callTrigger ({
                data
            })
            res.response_size = formatBytesToHumanReadable(res.response_size)
            setErrorMessage(null)
            setHistoryData(res)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error?.response?.data.detail
                setErrorMessage(errorMessage)

                if (Array.isArray(errorMessage)) {
                    console.log("유효성 검사 에러:", errorMessage[0].msg);
                }
            } else {
                console.error("일반 에러:", error);
            }
        }
    }

    const persistUpdate = (newData: ApiRequestUpdate) => {
        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        saveTimerRef.current = window.setTimeout(async () => {
            if (latestIdRef.current !== id) return
            const targetKey = `${get_api_request_url}/${id}`
            try {
                await globalMutate(
                    targetKey,
                    (prev: ApiRequest | undefined) => {
                        if (!prev) return prev as any
                        return {...prev, ...(newData as any)}
                    },
                    {revalidate: false}
                )
                await updateTrigger({
                    id,
                    data: newData
                })

            } catch (error) {
                await globalMutate(targetKey)
                console.error(error)
            }
        }, 200)
    }

    const updateField = async (key: keyof ApiRequestUpdate, value: any) => {
        const newData = {...requestData, [key]: value}
        setRequestData(newData)
        if (id) persistUpdate(newData)
    }

    const addDict = async (field: 'params' | 'headers') => {
        const newItem = [...requestData[field], newDict]

        const newData = {
            ...requestData,
            [field]: newItem
        }
        setRequestData(newData)
        if (id) persistUpdate(newData)
    }

    const updateDict = (field: 'params' | 'headers', index: number, key: string, value: any) => {
        const items = requestData[field]
        const newItems = items.map((item, i) =>
            i === index ? {...item, [key]: value} : item
        )

        const newData = {
            ...requestData,
            [field]: newItems,
        }

        setRequestData(newData)
        if (id) persistUpdate(newData)
    }

    const deleteDict = (field: 'params' | 'headers', index: number) => {
        const items = requestData[field]
        const newItems = items.filter((_, i) => i !== index)

        const newData = {
            ...requestData,
            [field]: newItems
        }

        setRequestData(newData)
        if (id) persistUpdate(newData)
    }

    const pretty = (() => {
        const body = historyData?.response_body;
        if (!body) return "";

        if (typeof body === "object") return JSON.stringify(body, null, 2);


        try {
            return JSON.stringify(JSON.parse(body), null, 2);
        } catch {
        }
    })();

    return {
        id, setId,
        requestData, setRequestData,
        historyData, setHistoryData,
        apis, api, apisIsLoading, errorMessage,
        createApiRequest, deleteApiRequest, callApiRequest, callMutating,
        updateField, addDict, updateDict, deleteDict,
        saveTimerRef, latestIdRef, pretty

    }

}