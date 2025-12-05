import React, { useState } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function HeroSection({ setIsCreate } : {setIsCreate: (value: boolean) => void}) {
    const { t } = useTranslation();
    return(
        <div className="relative  rounded-lg overflow-hidden group">
            <Image
              loading="lazy"
              src="/images/tournament-cover.jpg"
              alt="tournament cover"
              height={300}
              width={1200}
              className="w-full  h-[300px] object-cover  transition-transform duration-500 group-hover:scale-105"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none"/> */}
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8 lg:p-12">
              <h1 className="font-bold text-[20px] leading-tight lg:text-[30px] md:text-[25px]">
                {t('game.battleForCrown')}
              </h1>
              <p className="font-semibold text-[12px] lg:text-[17px] md:text-[15px] text-[#A4ACA7] mt-3">
                {t('game.joinEpicTournaments')}
              </p>
              <button
                onClick={() => setIsCreate(true)}
                className="flex items-center transition-colors cursor-pointer justify-center mt-8 md:mt-10 lg:mt-12 gap-2 rounded-lg
                                bg-cyan-700 text-[10px] p-1.5 lg:p-2.5 px-4 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4
                                text-sm md:text-base font-semibold  duration-300
                                hover:bg-cyan-500">
                <Plus className="w-4 h-4 md:w-5 md:h-5"/>
                {t('game.createTournament')}
              </button>
            </div>
        </div>
    )
}