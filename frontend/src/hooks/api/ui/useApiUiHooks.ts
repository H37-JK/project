import {useEffect, RefObject, useState, useRef, useCallback} from 'react'
import {useApiDataHooks} from "@/hooks/api/data/useApiDataHooks";



export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void) {
    useEffect(() => {
        const listener = (event: PointerEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener("pointerdown", listener, true);
        return () => document.removeEventListener("pointerdown", listener, true);
    }, [ref, handler]);
}
export function useApiUIHooks() {
    const { requestData } = useApiDataHooks()

    const [activeTab, setActiveTab] = useState("파라미터")
    const tabs = ['파라미터', '본문', '헤더', '인증', '사전요청 스크립트']

    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [isShowAlert, setIsShowAlert] = useState(false)
    const [showTrash, setShowTrash] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const httpMethodRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const authRef = useRef<HTMLDivElement>(null);

    const methodColorMap: Record<string, string> = {
        GET: "text-emerald-400",
        POST: "text-amber-500",
        PUT: "text-sky-400",
        PATCH: "text-purple-400",
        DELETE: "text-red-500",
        HEAD: "text-teal-400",
        OPTIONS: "text-indigo-400",
        CONNECT: "text-zinc-400",
        TRACE: "text-zinc-400",
        CUSTOM: "text-zinc-400",
    };

    const methodColor = requestData.method
        ? methodColorMap[requestData.method] ?? "text-zinc-400"
        : "text-zinc-400";

    const [dropdowns, setDropdowns] = useState({
        httpMethod: false,
        content: false,
        auth: false
    })

    const closeDropdown = useCallback((field: 'httpMethod' | 'content' | 'auth') => {
        setDropdowns(prev => ({...prev, [field]: false}))
    }, [])

    const toggleDropdown = (key: keyof typeof dropdowns) => {
        setDropdowns(prev => ({...prev, [key]: !prev[key]}))
    }

    const handleIsShowAlert = () => {
        setIsShowAlert(true)

        setTimeout(() => {
            setIsShowAlert(false)
        }, 1500)
    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    return {
        activeTab, setActiveTab, tabs,
        isShowAlert, setIsShowAlert,
        showTrash, setShowTrash,
        dropdowns, setDropdowns, toggleDropdown,
        isMenuToggle, setIsMenuToggle,
        httpMethodRef, contentRef, authRef,
        handleIsShowAlert, handleIsMenuToggle, closeDropdown,
        methodColor
    };
}