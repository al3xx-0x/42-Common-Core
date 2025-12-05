"use client"
import {Gamepad2, Monitor, Radio} from "lucide-react";
import {electric_blue} from "@/app/Utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function GameMode() {
    const { t } = useTranslation();
    return (
        <div className='flex pt-24 min-h-screen md:ml-20 '>
            <div className="flex-1  flex flex-col m-5 items-center   justify-between _border  bg-[#081C29]/80 rounded-2xl">
                <div className='pt-16 flex flex-row gap-4 items-center'>
                    <Gamepad2 size={48} color={electric_blue}/>
                    <a
                        style={{color: electric_blue}}
                        className="text-3xl font-bold">GAME MODE</a>
                </div>
                <div
                    className=" flex justify-center  xl:flex-row px-10 gap-10 items-center flex-wrap w-full">
                    {
                        [
                            {
                                icon: <Monitor size={48}/>,
                                title: t('game.localMatchTitle'),
                                desc: t('game.localMatchDesc'),
                                href: '/game/local/create'
                            },
                            {
                                icon: <Radio size={48}/>,
                                title: t('game.onlineMatchTitle'),
                                desc: t('game.onlineMatchDesc'),
                                href: '/matchmaking'
                            }
                        ].map((card, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col md:max-w-[512px]  items-center transition-all duration-300 border border-transparent  px-10 py-6 card-hover-effect  rounded-2xl gap-5 `}>
                                    <div className="bg-[#113A4B] p-5 rounded-full ">
                                        {card.icon}
                                    </div>
                                    <h1 className="font-bold text-xl text-[#00D9FF]">{card.title}</h1>
                                    <p className="text-center  p-2 text-lg text-gray-500">{card.desc}</p>
                                    <Link href={card.href} className='w-full transition-transform duration-300 hover:scale-y-105'>
                                        <button className="bg-[#0F1725] text-lg border transition-all duration-300 hover:bg-white/5 border-[#113A4B] w-full rounded-2xl p-3 pl-5 pr-5 cursor-pointer">{t('game.playNow')}</button>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </div>
                <div/>
            </div>
        </div>
    );
}