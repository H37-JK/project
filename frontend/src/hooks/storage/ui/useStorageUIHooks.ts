import {useRef, useState} from "react";

export function useStorageUIHooks() {
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isMenuToggle, setIsMenuToggle] = useState<boolean>(false)
    const [isSearchToggle, setIsSearchToggle] = useState<boolean>(false)
    const [isFileToggle, setIsFileToggle] = useState<boolean>(true)
    const [showTrash, setShowTrash] = useState<boolean>(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleRefresh = () => {
        setIsRefreshing(true)

        setTimeout(() => {
            setIsRefreshing(false)
        }, 1500)
    }

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const handleIsSearchToggle = () => {
        setIsSearchToggle(!isSearchToggle)
    }

    const handleIsFileToggle = () => {
        setIsFileToggle(!isFileToggle)
    }

    const onFileClick = () => {
        fileRef.current?.click()
    }

    return {
        isRefreshing,
        isMenuToggle,
        isSearchToggle,
        isFileToggle,
        showTrash, setShowTrash,
        handleRefresh,
        handleIsMenuToggle,
        handleIsSearchToggle,
        handleIsFileToggle,
        fileRef,
        onFileClick
    }

}