import {WebAnalyze} from "@/constants/web-analyze";
import {useWebAnalyzeDataHooks} from "@/hooks/web-analyze/data/useWebAnalyzeDataHooks";

interface WebAnalyzeComponentPros {
    data: WebAnalyze
}
const VALUE_LENGTH_THRESHOLD = 25;

const WebAnalyzeComponent = ({data}: WebAnalyzeComponentPros) => {
    const {formatValue} = useWebAnalyzeDataHooks()

    return (
        <div className="flex flex-1 overflow-hidden pl-0 md:pl-10">
            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="columns-1 md:columns-2 lg:columns-3 px-4 py-2 gap-6 overflow-auto items-start">
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Server Info
                        </div>

                        {data?.server_info && Object.entries(data.server_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Server Status Info
                        </div>

                        {data?.server_status_info && Object.entries(data.server_status_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            SSL Info
                        </div>

                        {data?.ssl_info && Object.entries(data.ssl_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md gap-1 break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            DNS Records
                        </div>

                        {data?.dns_record_info && Object.entries(data.dns_record_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md gap-1 break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Headers Info
                        </div>

                        {data?.headers_info && Object.entries(data.headers_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Whois
                        </div>

                        {data?.whois_info && Object.entries(data.whois_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Port Status Info
                        </div>

                        {data?.port_status_info && Object.entries(data.port_status_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid grid-cols-1 bg-zinc-800 p-4 rounded-md break-inside-avoid mb-6">
                        <div className="text-xl text-teal-700 font-bold">
                            Tech Stack Info
                        </div>

                        {data?.tech_stack_info && Object.entries(data.tech_stack_info).filter(([_, value]) => value !== null && value !== 'Unknown').map(([key, value]) => {
                            const valueAsString = formatValue(value)
                            const isLongValue = valueAsString.length > VALUE_LENGTH_THRESHOLD;

                            return (
                                <div key={key} className={`${isLongValue ? '!flex-col' : ''}  flex text-md border-b border-zinc-700 pb-1.5 pt-1.5`}>
                                    <div className="font-bold text-zinc-400 capitalize">{key}</div>
                                    <div className={`${isLongValue ? 'whitespace-pre-line' : 'flex flex-1 justify-end'} text-zinc-200 overflow-auto`}>
                                        {valueAsString}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default WebAnalyzeComponent