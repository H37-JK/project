import axios from 'axios'
import { getSession } from 'next-auth/react'

const api = axios.create({
    baseURL: 'http://localhost:8000'
})

api.interceptors.request.use(async (config) => {
    const session = await getSession()
    if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session?.user?.accessToken}`
    }
    return config
})

export const getFetcher = (url: string) => api.get(url).then(res => res.data)

export const createFetcher = async (url: string, {arg}: { arg: { data: any } }) => {
    const res = await api.post(url, arg.data);
    return res.data;
}

export const updateFetcher = async (url: string, {arg}: {arg: { id: string | null, data: any }}) => {
    const res = await api.patch(`${url}/${arg.id}`, arg.data)
    return res.data
}

export const deleteFetcher = async (url: string, {arg}: { arg: string }) => {
    const res = await api.delete(`${url}/${arg}`);
    return res.data;
}

export default api