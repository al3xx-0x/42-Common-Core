"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useTranslation } from "react-i18next"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { use, useEffect, useState } from "react"
import { fetchWithToken } from "@/app/Utils"
import { User, useUser } from "@/app/types"

export const description = "A line chart"

const chartConfig = {
  time: {
    label: "time (mins)",
    color: "#23ccdc",
  },
} satisfies ChartConfig

export function ChartLineDefault({user}: {user: User}) {
  const { t } = useTranslation();
  const {logtime} = user;
  const days = [
    t('profile.monday'),
    t('profile.tuesday'),
    t('profile.wednesday'),
    t('profile.thursday'),
    t('profile.friday'),
    t('profile.saturday'),
    t('profile.sunday')
  ];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Convert JS day (0=Sun) to array index


  // Initialize chartData with days starting from tomorrow to today
  const [chartData, setChartData] = useState([
    ...days.slice(todayIndex + 1).map(day => ({ day, time: 0 })),
    ...days.slice(0, todayIndex + 1).map(day => ({ day, time: 0 }))
  ]);

  // Update chartData when logtime changes
  useEffect(() => {
    if (logtime) {
      setChartData(prev => prev.map(item => {
        const dayLog = logtime.find(log => log.day === item.day);
        return {
          ...item,
          time: dayLog ? parseFloat((dayLog.time / 60).toFixed(0)) : 0
        };
      }));
    }
  }, [logtime, user]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // set current data in last week - September 2025 format
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60 * 1000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Compact */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-1">{t('profile.logTime')}</h3>
        <p className="text-sm text-gray-400">
          {`${t('profile.week')} ${Math.ceil(
            (currentDate.getDate() - currentDate.getDay() + 1) / 7)} - ${
            currentDate.toLocaleString("default", {
            month: "long",
          })} ${currentDate.getFullYear()}`}
        </p>
      </div>

      {/* Chart Content - Takes remaining space */}
      <div className="flex-1 px-2 pb-4">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "#a4aca7", fontSize: 12 }}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="time"
              type="monotone"
              stroke={chartConfig.time.color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}