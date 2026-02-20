
interface HttpMethodDropdownProps {
    isHttpMethodOpen: boolean
    setIsHttpMethodOpen: (selectedHttpMethod: boolean) => void
    setSelectedHttpMethod: (label: string) => void
}

const HttpMethodDropdown = ({isHttpMethodOpen, setIsHttpMethodOpen, setSelectedHttpMethod} : HttpMethodDropdownProps) => {

    const methods = [
        { label: 'GET', color: 'text-emerald-400' },
        { label: 'POST', color: 'text-amber-500' },
        { label: 'PUT', color: 'text-sky-400' },
        { label: 'PATCH', color: 'text-purple-400' },
        { label: 'DELETE', color: 'text-red-500' },
        { label: 'HEAD', color: 'text-teal-400' },
        { label: 'OPTIONS', color: 'text-indigo-400' },
        { label: 'CONNECT', color: 'text-zinc-400' },
        { label: 'TRACE', color: 'text-zinc-400' },
        { label: 'CUSTOM', color: 'text-zinc-400' },
    ];

    return (
        <>
                {isHttpMethodOpen && (
                    <div className="absolute top-4 left-8 z-10 w-48 mt-3 origin-top-left bg-[#1a1a1a] border border-zinc-800 rounded-md shadow-2xl focus:outline-none">
                        <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#1a1a1a] border-t border-l border-zinc-800 rotate-45"></div>
                        <div className="py-2 overflow-hidden rounded-md">
                            {methods.map((method) => (
                                <button
                                    key={method.label}
                                    onClick={() => {
                                        setIsHttpMethodOpen(false);
                                        setSelectedHttpMethod(method.label);
                                    }}
                                    className={`cursor-pointer block w-full px-5 py-2.5 text-left text-sm font-bold transition-colors hover:bg-zinc-800 ${method.color}`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
        </>
    );
};

export default HttpMethodDropdown;