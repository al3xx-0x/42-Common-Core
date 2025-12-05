import Image from "next/image";
import { gradient } from "@/app/Utils";
import ProgressBar from "@/app/(app)/components/ProgressBar";
import {Edit} from "lucide-react";
import { useTranslation } from "react-i18next";

type Player = {
    name: string;
    status: boolean;
    level: string;
    joined_date: string;
    xp: number;
    total_hours: number;
    average_hr_day: number;
};

export default function UserInfo() {
    const { t } = useTranslation();
    const player: Player = {
        name: "Aissam",
        status: true,
        level: "01",
        joined_date: "May 20, 2025",
        xp: 80,
        total_hours: 120,
        average_hr_day: 3,
    };

    return (
        <div className="flex flex-col  lg:flex-row items-center md:justify-between gap-6 bg-[#081C29]/80 p-6 rounded-lg border border-transparent hover:border-[#00F5FF]/30 duration-200">

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-6 lg:gap-10">
                {/* Profile Image */}
                <div className="bg-gradient-to-b from-[#00B3FF]/50 to-[#188C71]/50 rounded-lg p-[2px]">
                    <Image
                        src="/default.png"
                        alt="Profile image"
                        width={128}
                        height={128}
                        className="rounded-lg object-cover w-[200px] h-[200px]"
                    />
                </div>

                {/* Player Info */}
                <div className="flex flex-col items-center lg:items-start gap-3 py-5">
                    <h1 className="font-bold text-xl">{player.name}</h1>

                    <h2 className={`flex items-center gap-2 text-lg font-semibold ${player.status ? "text-[#00FF88]" : "text-gray-500"}`}>
                        {player.status ? (
                            <>
                                <span className="inline-block bg-[#00FF88] rounded-full h-3 w-3" />
                                Online
                            </>
                        ) : (
                            "Offline"
                        )}
                    </h2>

                    <div className={`rounded-full ${gradient} p-0.5 w-fit`}>
                        <div className="bg-[#081C29] rounded-full px-3 py-1 text-sm font-medium">
                            Level {player.level}
                        </div>
                    </div>

                    <h3 className="text-gray-400 text-sm">{player.joined_date}</h3>
                </div>
            </div>

            {/* Actions & Progress Section */}
            <div className="flex flex-col items-center lg:items-end gap-5">
                <button className="w-full  flex justify-center gap-6 py-2 px-4 rounded-lg bg-[#113A4B]/60 border border-[#00B3FF] hover:bg-[#081C29] transition-colors duration-300">
                    {t('game.editProfile')} <Edit className='size-6'/>
                </button>

                <div className="flex flex-col w-[256px]">
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Lv01</span>
                        <span>Lv02</span>
                    </div>
                    <ProgressBar value={50} />
                </div>
            </div>
        </div>
    );
}
