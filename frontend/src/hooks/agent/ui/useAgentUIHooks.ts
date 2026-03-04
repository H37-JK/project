import React, {useState} from "react";
import {useAgentDataHooks} from "@/hooks/agent/data/useAgentDataHooks";

export function useAgentUIHooks() {
    const [showTrash, setShowTrash] = useState<boolean>(false)
    const [isMenuToggle, setIsMenuToggle] = useState<boolean>(true)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const {createAgent} = useAgentDataHooks()

    const handleIsMenuToggle = () => {
        setIsMenuToggle(!isMenuToggle)
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            await createAgent()
        }
    }


    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };


    return {
        showTrash, setShowTrash,
        isMenuToggle, setIsMenuToggle,
        isModalOpen, setIsModalOpen,
        selectedId, setSelectedId,
        handleDeleteClick, handleKeyDown, handleIsMenuToggle
    }
}