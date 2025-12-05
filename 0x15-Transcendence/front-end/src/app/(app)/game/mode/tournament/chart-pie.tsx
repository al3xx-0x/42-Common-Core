"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { UserContext, useUser } from "@/app/types"
import { useTranslation } from "react-i18next"


const chartConfig = {
  win: { label: "Wins", color: "#22C55E" },
  lose: { label: "Losses", color: "#EF4444" },
}

export function ChartPieDonutText({user} : {user : User}) {
  const { t } = useTranslation();
  const defaultVal = [
    { type: "win", value: 0, fill: "#22C55E" },
    { type: "lose", value: 0, fill: "#EF4444" },
  ]

  const [winRate, setWinRate] = React.useState(0);
  const [chartData, setChartData] = React.useState<{type: string, value: number, fill: string}[]>(defaultVal);

  // const {user} = useUser();
  React.useEffect(() => {
    setWinRate(user.win_rate);
    setChartData([
      {
        type: "win",
        value: user.win_count,
        fill: "#22C55E"
      },
      {
        type: "lose",
        value: user.lose_count,
        fill: "#EF4444"
      }
    ]);
  }, [user]);
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">{t('profile.winRateStats')}</h3>
        <p className="text-sm text-gray-400">{t('profile.gamePerformanceOverview')}</p>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="w-full h-full">
        {
          chartData[0].value === 0 && chartData[1].value === 0 ?
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            {t('profile.noDataAvailable')}
          </div>
          :
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="type"
            innerRadius={50}
            outerRadius={80}
            stroke="#1E293B"
            strokeWidth={3}
            paddingAngle={2}
            cornerRadius={8}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox?.cy ?? 5) - 5}
                        className="fill-white text-2xl font-bold"
                      >
                        {winRate}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox?.cy ?? 0) + 15}
                        className="fill-gray-400 text-sm"
                      >
                        {t('game.winRate')}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
        }
      </ChartContainer>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white">{chartData[0].value} {t('game.wins')}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white">{chartData[1].value} {t('game.losses')}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">
              {t('profile.fromMatches', { count: chartData[0].value + chartData[1].value })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}