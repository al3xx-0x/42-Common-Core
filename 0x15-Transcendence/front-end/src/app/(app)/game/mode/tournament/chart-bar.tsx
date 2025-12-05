"use client"

import { Crown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useTranslation } from "react-i18next"

const chartData = [
  { Placement: "1st Place", times: 5 },
  { Placement: "2nd Place", times: 10 },
  { Placement: "3rd Place", times: 7 },
]

const chartConfig = {
  times: {
    label: "Times",
    color: "#3B82F6",
  },
} satisfies ChartConfig

export function ChartBarDefault() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">Placement Stats</h3>
        <p className="text-sm text-gray-400">Tournament placement history</p>
      </div>

      {/* Chart Content */}
      <div className="flex-1 flex justify-center items-center">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="Placement"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="times" 
              fill="#3B82F6" 
              radius={8}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="text-center">
        <div className="flex flex-row justify-center items-center gap-2">
          <Crown className="h-5 w-5 text-[#339AF0]"/>
          <h3 className="text-lg font-semibold text-[#339AF0]">{chartData.find(item => item.Placement === "1st Place")?.times || 0} {t('game.totalPodium')}</h3>
        </div>
        <p className="text-sm text-gray-400">{t('game.from')} {chartData.reduce((total, item) => total + item.times, 0)} {t('game.tournamentsParticipated')}</p>
      </div>
    </div>
  )
}