import "@/styles/globals.css";
import type {AppProps} from "next/app";
import localFont from "next/font/local";
import Header from "@/layout/header/Header";
import SideMenuList from "@/layout/side/SideMenuList";


const pretendard = localFont({
    src: "../../public/fonts/PretendardVariable.woff2",
    display: "swap",
    weight: "45 920",
    variable: "--font-pretendard",
});


export default function App({Component, pageProps}: AppProps) {
    return (
        <main className={`${pretendard.className} overflow-hidden h-screen`}>
            <div className="flex flex-col w-full h-full">
                {/*헤더*/}
                <Header/>
                <div className="flex flex-1 overflow-hidden relative">
                    {/*사이드바*/}
                    <SideMenuList/>
                    <Component {...pageProps} />
                </div>
            </div>
        </main>
    )
}
