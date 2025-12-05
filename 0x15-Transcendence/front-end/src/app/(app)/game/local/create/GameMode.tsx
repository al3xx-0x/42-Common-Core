"use client"
import {ChevronDown, ChevronUp, RectangleHorizontal} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {dark_blue} from "@/app/Utils";
import {useTranslation} from "react-i18next";


enum SelectedMode {
    TIMED,
    CLASSIC
}

export default function GameMode() {
    const { t } = useTranslation();

    const [modeOpen, setModeOpen] = useState(false)
    const [scoreLimitOpen, setScoreLimitOpen] = useState(false)
    const [timedText, setTimedText] = useState("Classic")
    const [scoreText, setScoreText] = useState("5 points")

    const [timeLimitTextOpen, setTimeLimitTextOpen] = useState(false)
    const [timeLimitText, setTimeLimitText] = useState("30 sec")

    const [selectedMode, setSelectedMode] = useState(SelectedMode.CLASSIC)

    // Add refs for each dropdown
    const modeRef = useRef<HTMLDivElement>(null)
    const scoreLimitRef = useRef<HTMLDivElement>(null)
    const timeLimitRef = useRef<HTMLDivElement>(null)

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modeRef.current && !modeRef.current.contains(event.target as Node)) {
                setModeOpen(false)
            }
            if (scoreLimitRef.current && !scoreLimitRef.current.contains(event.target as Node)) {
                setScoreLimitOpen(false)
            }
            if (timeLimitRef.current && !timeLimitRef.current.contains(event.target as Node)) {
                setTimeLimitTextOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])



    return (
        <div className="relative backdrop-blur-2xl w-full flex flex-col gap-5  p-10 pl-5 pr-5 rounded-lg border-gray-500  card-hover-effect">
            <div className="flex flex-col gap-2">
                {
                    /*#####
                    ## Game Mode
                    #####*/
                }
                {/*<h2 className='font-bold text-xl'>Mode</h2>*/}
                <div className="flex items-center mb-6">
                    <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
                        <RectangleHorizontal className="h-5 w-5 text-[#23ccdc]" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{t("game.table")}</h2>
                </div>
                <div className="flex flex-row" ref={modeRef}>
                    <button onClick={() => setModeOpen(!modeOpen)} className="cursor-pointer flex flex-row gap-5 justify-between border w-full p-2 border-[#00F5FF]/30 bg-black/30 rounded-lg ">
                        <a>{timedText}</a>
                        <span>{modeOpen ? <ChevronUp/> : <ChevronDown/>}</span>
                    </button>
                    {
                        modeOpen &&
                        <div className="absolute right-0 w-40 border-[#00F5FF]/30 bg-black/50 border rounded-lg  shadow-md z-10 mt-10">
                            <ul className="py-1 text-sm  text-gray-700">
                                {
                                    ["Timed", "Classic"].map((val, index) => {
                                        return (
                                            <li key={index} onClick={() => {
                                                setTimedText(val)
                                                setModeOpen(false)
                                                setSelectedMode(index == 0 ? SelectedMode.TIMED : SelectedMode.CLASSIC)
                                            }} className="px-4 py-2 duration-500  hover:bg-[#00F5FF]/50 text-white cursor-pointer">{val}</li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>

            {
                /*#####
                ## Score Limit
                #####*/
            }
            <div className=" flex flex-col gap-2">
                <h2 >Score Limit</h2>
                <div className=" flex flex-row mt-0 justify-end" ref={scoreLimitRef}>

                    <button onClick={() => setScoreLimitOpen((!scoreLimitOpen && selectedMode != SelectedMode.TIMED))}
                            className={`cursor-pointer   flex flex-row gap-5 justify-between border w-full p-2 ${selectedMode == SelectedMode.CLASSIC ? "border-[#00F5FF]/30 bg-black/30 text-white" : " border-[#00F5FF]/10 bg-[#24272D]/30 text-gray-400"} rounded-lg `}>
                        {scoreText} {scoreLimitOpen ? <ChevronUp/> : <ChevronDown/>}
                    </button>
                    {
                        scoreLimitOpen &&
                        <div className="absolute right-0 w-40 backdrop-blur-2xl border border-[#00F5FF]/30 rounded-lg shadow-md  z-50 mt-10">
                            <ul className="py-1 text-sm text-gray-700">
                                {
                                    [5, 8, 10, 12, 15].map((number, index) => {
                                        return (
                                            <li key={index} onClick={() => {
                                                setScoreText(`${number} points`)
                                                setScoreLimitOpen(false)
                                            }} className="px-4 py-2 duration-500 hover:bg-[#00F5FF]/50 text-white cursor-pointer">{number} points</li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>

            {
                /*#####
                ## Time Limit
                #####*/
            }

            <div className=" flex flex-col gap-2">
                <h2>Time Limit</h2>
                <div className="flex flex-row justify-end" ref={timeLimitRef}>
                    <button onClick={() => setTimeLimitTextOpen(!timeLimitTextOpen && selectedMode != SelectedMode.CLASSIC)}
                            className={`cursor-pointer flex flex-row gap-5 justify-between border w-full p-2 ${
                                selectedMode == SelectedMode.TIMED ? "border-[#00F5FF]/30 bg-black/30 text-white" : " border-[#00F5FF]/10 text-gray-400"}
                            rounded-lg `}>
                        {timeLimitText} {timeLimitTextOpen ? <ChevronUp/> : <ChevronDown/>}
                    </button>
                    {
                        timeLimitTextOpen &&
                        <div className={`absolute right-0 w-40 backdrop-blur-2xl rounded-2xl border border-[#00F5FF]/30 shadow-md z-10 mt-10`}>
                            <ul className="py-1 text-sm text-gray-700">
                                {
                                    [60, 120, 240, 360, 480].map((number, index) => {
                                        return (
                                            <li key={index} onClick={() => {
                                                setTimeLimitText(`${number} sec`)
                                                setTimeLimitTextOpen(false)
                                            }} className="px-4 py-2 duration-500 font-semibold  hover:bg-[#00F5FF]/50 text-white  cursor-pointer">{number} sec</li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    }
                </div>
            </div>

        </div>
    );
}
