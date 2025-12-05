"use client";
import Link from "next/link";
import {Bungee, Orbitron} from "next/font/google";
import { Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import {useTranslation} from "react-i18next"
import {useRouter} from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"], weight: "800" });
const bungee = Bungee({ subsets: ["latin"], weight: "400" });

export default function LandingPage() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    return (
        <div className="flex-1 md:ml-20 ml-4 pt-2">
            <div className="flex flex-row items-center justify-between mb-40">
                <div className="flex flex-row items-center justify-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="Zero Serve Logo"
                        className="h-auto md:w-16 w-10"
                    />
                    <p className={`bg-gradient-to-r md:text-3xl font-bold bg-clip-text text-transparent from-cyan-400 to-white ${orbitron.className}`}>ZeroServe</p>
                </div>
                <div className="flex flex-row items-center md:gap-4 gap-2 p-5">
                    <Link href={"auth?mode=sign-in"}>
                        <button
                            className="border border-white  rounded-full md:px-6 md:py-2 px-4 py-1 hover:border-[white]/50 transition-all duration-300 transform hover:scale-105">
                            Sign in
                        </button>
                    </Link>
                    <Link href={"auth?mode=sign-up"}>
                        <button className="border border-[#00BBFF]/60 bg-[#1B4565] hover:bg-[#1B4575] rounded-full md:px-6 md:py-2 px-4 py-1 transition-all duration-300 transform hover:scale-105">
                            {t("game.signUp")}
                        </button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse justify-between">
                <div className="flex flex-col justify-center gap-3  order-1 mt-10 md:mt-0">
                    <h1 className={`text-6xl md:text-8xl lg:text-[160px] font-bold mb-6 ${orbitron.className}`}>
                        <span className="bg-gradient-to-r from-white to-cyan-500  bg-clip-text text-transparent">
                            Zero
                        </span>
                        <br className="hidden sm:block"/>
                        <span className="bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">
                            Serve
                        </span>
                    </h1>
                    <p className="lg:text-lg  text-sm">{t("game.landingDescription")}</p>
                    <div className="md:mt-20 mt-4">
                        <button
                        onClick={() => {
                            if (!sessionStorage.getItem('accessToken'))
                                router.push('/auth?mode=sign-in');
                            else
                                router.push('/Home');
                        }}
                            className={`flex flex-row items-center justify-center gap-2 rounded-2xl border border-[#00BBFF]/20 bg-[#1B4565] md:px-8 md:py-4 px-6 py-3 font-bold md:text-2xl
                                            hover:border-[#00BBFF] transition-all duration-300 transform hover:scale-105 ${bungee.className}`}>
                            Play Now
                            <Gamepad2 className="h-auto w-8"/>
                        </button>
                    </div>
                </div>
                <div className="mb-20 md:mb-0">
                    <motion.div
                        initial={{ x: 400, opacity: 0, rotate: 25 }}
                        animate={{
                            x: 0,
                            opacity: 1,
                            rotate: 0,
                            transition: { type: "spring", stiffness: 50, damping: 12 }
                        }}
                    >
                        <motion.img
                            src="/images/animation.png"
                            alt="Player Mascot"
                            className="w-[600px] h-auto drop-shadow-[0_0_25px_rgba(0,255,255,0.6)]"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}