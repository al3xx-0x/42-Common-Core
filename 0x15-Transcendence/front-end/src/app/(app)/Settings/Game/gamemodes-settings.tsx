"use client"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Settings2} from "lucide-react"
import {useTranslation} from "react-i18next"
import {GameMode, useGame} from "@/app/types";

export default function GameModeSettings() {
  const { t } = useTranslation();

  const {
    gameMode,
    scoreLimit,
    gameTime,
    setGameMode,
    setGameTime,
    setScoreLimit
  } = useGame();

  const selectConfigs = [
    {
      label: t("game.mode"),
      defaultValue: gameMode === GameMode.CLASSIC ? t("game.classic") : t("game.timed") ,
      options: [t("game.classic"), t("game.timed")],
    },
    {
      label: t("game.scoreLimit"),
      value: `${scoreLimit} ${t("game.points")}`,
      defaultValue: `3 ${t("game.points")}`,
      options: [`3 ${t("game.points")}`, `5 ${t("game.points")}`, `7 ${t("game.points")}`, `11 ${t("game.points")}`],
    },
    {
      label: t("game.timeLimit"),
      value: `${gameTime / 60} ${t("game.min")}`,
      defaultValue: `1 ${t("game.min")}`,
      options: [`1 ${t("game.min")}`, `2 ${t("game.min")}`, `3 ${t("game.min")}`],
    },
  ];

  return (
    <div className="rounded-lg border card-hover-effect transition-all duration-300 h-full">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 mr-2 rounded-lg border" style={{ backgroundColor: "#00F5FF1A", borderColor: "#00F5FF8A" }}>
            <Settings2 className="h-5 w-5 text-[#23ccdc]" />
          </div>
          <h2 className="text-xl font-semibold text-white">{t("game.gameMode")}</h2>
        </div>
        <div className="space-y-3">
          {selectConfigs.map(({ label, value, defaultValue, options }, index) => {
            const isoff =
              (label === t("game.timeLimit") && gameMode === GameMode.CLASSIC) ||
              (label === t("game.scoreLimit") && gameMode === GameMode.TIMED);
            return (
              <div key={label} className={isoff ? "opacity-50 pointer-events-none" : ""}>
                <label className="block text-[#a4aca7] text-[17px] mb-2">{label}</label>
                <Select
                  defaultValue={defaultValue}
                  value={value}
                  disabled={isoff}
                  onValueChange={(value) => {
                      switch (label) {
                          case t("game.mode"):
                              setGameMode((value === t("game.classic") ? GameMode.CLASSIC : GameMode.TIMED))
                              break
                          case t("game.timeLimit"):
                              setGameTime(Number(value.split(' ')[0]) * 60)
                              break
                          case t("game.scoreLimit"):
                              setScoreLimit(Number(value.split(' ')[0]))
                              break
                      }
                  }}
                >
                  <SelectTrigger className="bg-[#113A4B]/50 border-[#498195]/30 text-white focus:border-[#23ccdc] focus:ring-0 focus:ring-offset-0 data-[state=open]:border-[#23ccdc]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#081C29] border-[#21364a]">
                    {options.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-white hover:bg-[#113A4B]/50"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
