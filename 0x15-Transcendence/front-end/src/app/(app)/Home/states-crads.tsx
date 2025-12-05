import { UserContext, useUser } from "@/app/types";
import { Joystick, TrendingUp, Trophy, Users } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export type Stat = {
	title: string;
	value: number;
	icon: string;
	color: string;
}

export default function StatesCards() {
  const { t, i18n } = useTranslation();
  const {user} = useUser();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {[
            { title: t("game.matchesPlayed"), value: user.match_count, icon: <Joystick/>},
            { title: t("game.winRate"), value: `${user.win_rate}%`, icon: <Trophy/>},
            { title: t("game.rank"), value: user.leaderboard.findIndex(u => u.id === user.id) + 1, icon: <TrendingUp/>},
            { title: t("game.friends"), value: user.friends_count, icon: <Users/>},
          ].map((item, index:number) => (
            <div
              key={index}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--x", `${x}px`);
                e.currentTarget.style.setProperty("--y", `${y}px`);
              }}
              className="relative overflow-hidden rounded-lg border border-[#21364a]/90 bg-[#081C29]/80 transition-all duration-300 group"
            >
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              style={{
                background:
                  "radial-gradient(150px circle at var(--x) var(--y), rgba(35,204,220,0.25), transparent 80%)",
              }}/>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#a4aca7] text-xs md:text-sm mb-1 md:mb-2">{item.title}</p>
                    <p className="text-xl md:text-3xl font-bold text-white">{item.value}</p>
                  </div>
                  <div className="p-2 md:p-3 rounded-lg bg-cyan-500/20 text-cyan-500">
                    {item.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    )
}