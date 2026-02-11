import { IoWarningOutline } from "react-icons/io5";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-black/15 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl transition-all animate-in fade-in zoom-in duration-200">

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                        <IoWarningOutline className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                        {message}
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className="cursor-pointer flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20"
                    >
                        삭제하기
                    </button>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}