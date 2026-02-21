export interface ApiRequestProps {
    name: string
}

export interface ApiRequest {
    id: string
    name: string
    method: string
    url: string
    headers: Record<string, any>[]
    params: Record<string, any>[]
    body_type?: string
    body_content?: Record<string, any>
    auth_type?: string
    auth_content?: Record<string, any>
    tab_active: boolean
    is_deletable: boolean
    update_at: string
}

export interface ApiRequestUpdate {
    id: string | null
    name: string | null
    method: string | null
    url: string | null
    headers: Record<string, any>[]
    params: Record<string, any>[]
    body_type?: string | null
    body_content?: Record<string, any> | null
    auth_type?: string | null
    auth_content?: Record<string, any> | null
    tab_active: boolean
    update_at: string | null
}

export interface ApiRequestHistory {
    id: string | null
    method: string | null
    url: string | null
    header_sent: Record<string,  any>[] | null
    body_sent: Record<string, any>[] | null
    staus_code: number | null
    duration_ms: number | null
    response_size: number | null
    response_body: Record<string, any> | null
    response_headers: Record<string, any> | null
    error_message: Record<string, any> | null
}