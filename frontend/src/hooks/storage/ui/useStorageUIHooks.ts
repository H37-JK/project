import {useRef, useState} from "react";

export function useStorageUIHooks() {
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const [isMenuToggle, setIsMenuToggle] = useState<boolean>(false)
    const [isSearchToggle, setIsSearchToggle] = useState<boolean>(false)
    const [isShowAlert, setIsShowAlert] = useState<boolean>(false)
    const [alertMessage, setAlertMessage] = useState<string>(null)
    const [isFileToggle, setIsFileToggle] = useState<boolean>(true)
    const [showTrash, setShowTrash] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>(null)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleRefresh = () => {
        setIsRefreshing(true)

        setTimeout(() => {
            setIsRefreshing(false)
        }, 1500)
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

    const handleIsSearchToggle = () => {
        setIsSearchToggle(!isSearchToggle)
    }

    const handleIsFileToggle = () => {
        setIsFileToggle(!isFileToggle)
    }

    const onFileClick = () => {
        fileRef.current?.click()
    }

    const handleCopyLink = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setAlertMessage("클립 보드에 복사 되었습니다.")
            handleIsShowAlert()
        } catch (err) {
            console.error("복사 실패:", err);
            const textArea = document.createElement("textarea");
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setAlertMessage("클립 보드에 복사 되었습니다.")
                handleIsShowAlert()
            } catch (err) {
                setAlertMessage("복사 할 수 없습니다.")
                handleIsShowAlert()
            }
            document.body.removeChild(textArea);
        }
    };

    return {
        isRefreshing,
        isMenuToggle,
        isSearchToggle,
        isFileToggle,
        showTrash, setShowTrash,
        searchValue, setSearchValue,
        isShowAlert, setIsShowAlert, alertMessage, setAlertMessage, handleIsShowAlert,
        handleRefresh,
        handleIsMenuToggle,
        handleIsSearchToggle,
        handleIsFileToggle,
        fileRef,
        onFileClick,
        handleCopyLink
    }

}