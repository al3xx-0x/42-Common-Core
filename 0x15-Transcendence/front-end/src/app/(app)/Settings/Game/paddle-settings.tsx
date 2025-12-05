"use client"
import {useEffect, useState} from "react"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import Slider from "@/app/(app)/components/Slider";

const paddleColors = [
  { label: "White", hex: "#ffffff" },
  { label: "Red", hex: "#e83d3d" },
  { label: "Green", hex: "#01cb01" },
  { label: "Blue", hex: "#1e90ff" },
  { label: "Yellow", hex: "#f1c40f" },
  { label: "Purple", hex: "#9b59b6" },
  { label: "Orange", hex: "#e67e22" },
];
const labelPaddleSize =[
  {label:"game.tiny", size:100},
  {label:"game.small", size:120},
  {label:"game.medium", size:130},
  {label:"game.large", size:140}
]

interface PaddleSettingsProps {
    selectedPaddleColor: string;
    setSelectedPaddleColor: (color: string) => void;
    setPaddleSize: (size: number) => void;
  }

  export default function PaddleSettings(
      {
          paddleSize,
          selectedPaddleColor,
          setSelectedPaddleColor,
          setPaddleSize,
      }
      :
      {
          paddleSize: number,
          selectedPaddleColor: string,
          setSelectedPaddleColor: (color: string) => void,
          setPaddleSize: (size: number) => void,
      }
  ) {

    const options = [100, 125, 150, 180];

    const [_paddleSize, _setPaddleSize] = useState(0);

      useEffect(() => {
        const idx = options.indexOf(paddleSize);
        if (idx !== -1) _setPaddleSize(idx);
      }, [paddleSize]);

    const { t } = useTranslation();
    const handleColorSelect = (color: { label: string; hex: string }) => {
      setSelectedPaddleColor(color.hex)
    }
  return (
    <div className="rounded-lg border bg-[#081C29]/80 border-[#21364a] hover:border-[#23ccdc]/30 transition-all duration-300 h-full">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
            <img src="images/match.png" alt="Paddle-icon" className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.paddle")}</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-[#a4aca7] text-[17px] mb-2">{t("game.paddleColor")}</label>
          <div className="flex gap-2 flex-wrap">
            {paddleColors.map((color) => (
              <button
                onClick={() => handleColorSelect(color)}
                key={color.label}
                aria-label={color.label}
                className={`flex justify-center items-center w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  selectedPaddleColor === color.hex
                    ? 'border-[#23ccdc] shadow-[0_0_8px_#23ccdc]'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{backgroundColor: color.hex}}
              >
                {selectedPaddleColor === color.hex && (
                  <Check className="w-6 h-6"/>
                )}
              </button>
            ))}
          </div>
            <Slider
                initial={_paddleSize}
                title={t("game.paddleSize")}
                subtitle={t(labelPaddleSize[_paddleSize].label)}
                minValue={0}
                maxValue={3}
                action={(val) => {
                    setPaddleSize(options[val])
                    _setPaddleSize(val)
                }}
            />
        </div>
      </div>
    </div>
  )
}
