import {useEffect, RefObject, useState, useRef, useCallback} from 'react'
import {useApiDataHooks} from "@/hooks/api-request/data/useApiDataHooks";
import {requestIdleCallback} from "next/dist/client/request-idle-callback";


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

    const [activeMenu, setActiveMenu] = useState('api')

    const [activeTab, setActiveTab] = useState("파라미터")
    const tabs = ['파라미터', '본문', '헤더', '인증']

    const [isMenuToggle, setIsMenuToggle] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [selectedName, setSelectedName] = useState<string>(null)
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
    const [alertMessage, setAlertMessage] = useState<string>(null)
    const [showTrash, setShowTrash] = useState(false)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const httpMethodRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const authRef = useRef<HTMLDivElement>(null);

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
        }, 2000)
    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const closeHttpMethod = useCallback(() => {
        setDropdowns(p => ({ ...p, httpMethod: false }));
    }, []);

    const closeContent = useCallback(() => {
        setDropdowns(p => ({ ...p, content: false }));
    }, []);


    const closeAuth = useCallback(() => {
        setDropdowns(p => ({ ...p, auth: false }));
    }, []);

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };


    useClickOutside(httpMethodRef, closeHttpMethod);
    useClickOutside(contentRef, closeContent);
    useClickOutside(authRef, closeAuth);


    return {
        activeMenu, setActiveMenu,
        activeTab, setActiveTab, tabs,
        isShowAlert, setIsShowAlert,
        showTrash, setShowTrash,
        alertMessage, setAlertMessage,
        editModalOpen, setEditModalOpen,
        selectedId, setSelectedId,
        selectedName, setSelectedName,
        dropdowns, setDropdowns, toggleDropdown,
        isMenuToggle, setIsMenuToggle, handleDeleteClick,
        isModalOpen, setIsModalOpen,
        httpMethodRef, contentRef, authRef,
        handleIsShowAlert, handleIsMenuToggle, closeDropdown,
    };
}