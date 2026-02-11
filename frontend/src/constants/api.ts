export interface ApiRequestProps {
    name: string
}

export interface ApiRequest {
    id: string
    name: string
    method: string
    url: string
    headers: any[]
    params: any[]
    body_type?: string
    body_content?: Record<string, any>
    auth_type?: string
    auth_content?: Record<string, any>
    update_at: string
}