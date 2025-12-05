import { Hourglass, Swords } from "lucide-react";
import React from "react";
import { LineChart } from "recharts";
import { ChartLineDefault } from "./lineChart";
import { User } from "@/app/types";
import { useTranslation } from "react-i18next";

export default function TimeSpend({user}: {user: User}){

    const { t } = useTranslation();
    return (
        <div className="xl:col-span-1">
            <div className="bg-[#081C29]/80  border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg w-full h-full">
                <div className="p-3 md:p-4 h-full flex flex-col">
                    <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
                        <div className="flex flex-row items-center">
                            <div className="bg-cyan-500/20 p-2 rounded-lg flex items-center justify-center mr-3">
                                <Hourglass className="h-4 w-4 md:h-5 md:w-5  text-cyan-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                {t('profile.timeSpent')}
                            </h2>
                        </div>
                    </div>
                <ChartLineDefault user={user}/>
                </div>
            </div>
        </div>
    )
}