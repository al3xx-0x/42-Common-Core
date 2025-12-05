"use client"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import {useEffect, useState} from "react";
import Slider from "@/app/(app)/components/Slider";




export type stats = {
  paddleColor: string;
  ballColor: string;
  imageBg: string;
  paddleSize: number;
  ballSize: number;
  ballSpeed: number;
}

interface BallSettingsProps {
  selectedBallColor: string;
  ballSize: number;
  setSelectedBallColor: (color: string) => void;
  ballSpeed: number;
  setBallSpeed: (speed: number) => void;
  setBallSize: (size: number) => void;
}

export default function BallSettings({selectedBallColor, ballSize, ballSpeed, setSelectedBallColor, setBallSpeed, setBallSize}: BallSettingsProps) {
  const { t } = useTranslation();
    const [_ballSize, _setBallSize] = useState(0)
    const [_ballSpeed, _setBallSpeed] = useState(0)

  const ballSizeOptions = [20, 25, 30, 35];
  const ballSpeedOptions = [10, 15, 20, 30];

  useEffect(() => {
    const idx_size = ballSizeOptions.indexOf(ballSize);
    const idx_speed = ballSpeedOptions.indexOf(ballSpeed);

    if (idx_size === -1 || idx_size === -1) return;

    _setBallSize(idx_size);
    _setBallSpeed(idx_speed);
  }, [ballSize, ballSpeed]);

  const ballColors = [
    { label: "White", hex: "#ffffff" },
    { label: "Red", hex: "#e83d3d" },
    { label: "Green", hex: "#01cb01" },
    { label: "Blue", hex: "#1e90ff" },
    { label: "Yellow", hex: "#f1c40f" },
    { label: "Purple", hex: "#9b59b6" },
    { label: "Orange", hex: "#e67e22" },
  ];

  const labelPaddleSize =[
    {label: t("game.tiny"), size:1},
    {label: t("game.small"), size:2},
    {label: t("game.medium"), size:3},
    {label: t("game.large"), size:4}
  ]
  const labelballSpeed=[
    {label: t("game.slow"), size:1},
    {label: t("game.normal"), size:2},
    {label: t("game.fast"), size:3},
    {label: t("game.speed"), size:4}
  ]
  const handleColorBSelect = (color : { label: string; hex: string }) => {
    setSelectedBallColor(color.hex)
  }
  return (
    <div className="rounded-lg border bg-[#081C29]/80 border-[#21364a] hover:border-[#23ccdc]/30 transition-all duration-300 h-full">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
            <img src="images/match.png" alt="Ball-icon" className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.ball")}</h2>
        </div>
        <div className="space-y-3">
          <label className="block text-[#a4aca7] text-[17px] mb-2">{t("game.ballColor")}</label>
          <div className="flex gap-2 flex-wrap">
            {ballColors.map((color) => (
              <button
                onClick={() => handleColorBSelect(color)}
                key={color.label}
                aria-label={color.label}
                className={`flex justify-center items-center w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  selectedBallColor === color.hex
                    ? 'border-[#23ccdc] shadow-[0_0_8px_#23ccdc]'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{backgroundColor: color.hex}}
              >
                {selectedBallColor === color.hex && (
                  <Check className="w-6 h-6"/>
                )}
              </button>
            ))}
          </div>
          <Slider
              title={t("game.ballSpeed")}
              subtitle={labelballSpeed[_ballSpeed].label}
              initial={_ballSpeed}
              minValue={0}
              maxValue={3}
              action={(val) => {
                setBallSpeed(ballSpeedOptions[val])
                _setBallSpeed(val)
              }}
          />

          <Slider
              initial={_ballSize}
              title={t("game.ballSize")}
              subtitle={labelPaddleSize[_ballSize].label}
              minValue={0}
              maxValue={3}
              action={(val) => {
                setBallSize(ballSizeOptions[val])
                _setBallSize(Number(val))
              }}
          />
        </div>
      </div>
    </div>
  )
}
