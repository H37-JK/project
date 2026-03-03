import {useEffect, useRef} from "react";
import {useWebAnalyzeUiHooks} from "@/hooks/web-analyze/ui/useWebAnalyzeUiHooks";
import {useWebAnalyzeDataHooks} from "@/hooks/web-analyze/data/useWebAnalyzeDataHooks";

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

export function useUiHooks({onCallRequest, canSend}: ApiUiProps) {
    useHotkeys('Enter', () => {
        onCallRequest();
    });

    return {};
}