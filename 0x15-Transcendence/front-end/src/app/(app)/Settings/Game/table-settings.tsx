"use client"
import { ChevronLeft, ChevronRight, RectangleHorizontal, SquareChevronLeft, SquareChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { Motion, useGame } from "@/app/types";

// export const images = [
//   "/images/got-table.webp",
//   "/images/dark-table.webp",
//   "/images/got1-table.webp",
// ];



export default function TableSettings() {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    const images: string[] = [
        "https://www.creativefabrica.com/wp-content/uploads/2023/05/11/Modern-colourful-abstract-background-Graphics-69439498-1.jpg",
        "https://4kwallpapers.com/images/walls/thumbs_3t/8324.png",
        "https://4kwallpapers.com/images/walls/thumbs_3t/2092.jpg",
        "https://4kwallpapers.com/images/walls/thumbs_3t/2654.jpg",
        "https://www.creativefabrica.com/wp-content/uploads/2022/05/17/Futuristic-Red-Blue-Background-Design-Graphics-30683310-1.jpg"
    ]
    const prevImage = () => {
      setIndex((prev: number) => (prev === 0 ? images.length - 1 : prev - 1))
    }
    const nextImage = () => {
      setIndex((prev: number) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    useEffect(() => {
      setBackgroundImage(images[index])
    }, [index]);

    const {backgroundEnabled, setBackgroundEnabled, setBackgroundImage} = useGame();
  return (
    <div className="rounded-lg card-hover-effect transition-all duration-300 w-full">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
            <RectangleHorizontal className="h-5 w-5 text-[#23ccdc]" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.table")}</h2>
        </div>
        <label className="block text-[#a4aca7] text-[17px] mb-6">{t("game.chooseTable")}</label>
        <div className="flex flex-row items-center justify-center gap-4 md:gap-6 lg:gap-4">
          <div className="flex relative w-full  flex-col items-center">
            <div className="border border-[#374151] rounded-lg  w-full h-[180px]  md:h-[110px] md:w-[180px] lg:h-[150px] lg:w-[310px] mb-2">
              <Motion.div
                key={backgroundEnabled ? images[index] : 'no-bg'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0}}
                style={backgroundEnabled ? { backgroundImage: `url(${images[index]})` } : {}}
                className=" w-full h-full rounded-lg bg-cover bg-center "
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                defaultChecked
                type="checkbox"
                id="background"
                checked={backgroundEnabled}
                onChange={() => setBackgroundEnabled(!backgroundEnabled)}
                className="w-4 h-4 accent-[#23ccdc]"
              />
              <label
                htmlFor="background"
                className="text-[#D9D9D9] text-sm cursor-pointer font-medium"
              >
                {t("game.background")}
              </label>
            </div>
            <button
             disabled={!backgroundEnabled}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-cyan-500/10 text-cyan-500 disabled:bg-gray-500/30 disabled:text-white/50  h-16 rounded-full backdrop-blur-sm  transition-transform duration-200" onClick={prevImage}>
              <ChevronLeft className="h-8 w-8 " />
            </button>
            <button
              disabled={!backgroundEnabled}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-cyan-500/10 h-16 text-cyan-500 disabled:bg-gray-500/30 disabled:text-white/50 rounded-full backdrop-blur-sm transition-transform duration-200" onClick={nextImage}>
                <ChevronRight className="size-6 md:size-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
