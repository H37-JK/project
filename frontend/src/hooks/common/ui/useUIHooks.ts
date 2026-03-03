import {useEffect, useRef} from "react";
import {useWebAnalyzeUIHooks} from "@/hooks/web-analyze/ui/useWebAnalyzeUIHooks";
import {useWebAnalyzeDataHooks} from "@/hooks/web-analyze/data/useWebAnalyzeDataHooks";

interface ApiUiProps {
    onCallRequest: () => void;
    canSend: boolean;
}

export function useHotkeys(key: string, callback: () => void) {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrMeta = event.ctrlKey || event.metaKey;

            if (isCtrlOrMeta && event.key === key) {
                event.preventDefault();
                callbackRef.current();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [key]);
}

export function useUIHooks({onCallRequest, canSend}: ApiUiProps) {
    useHotkeys('Enter', () => {
        onCallRequest();
    });

    return {};
}