import { User } from "@/app/types";
import { achievementRank, getImageUrl } from "@/app/Utils";
import { BarChart3, Crown, Flame, Medal, Star, Trophy } from "lucide-react"
import { router } from "next/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

// export type stat = {
//   rank: number;
//   player: string;
//   wins: string;
//   score: string;
//   avatar: string;
//   badge: string;
// }

export default function Leaderboard({ leaderboard }: { leaderboard: User[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="xl:col-span-2">
      <div className="h-full bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg">
        <div className="p-3 md:p-4 h-full flex flex-col">
          <div className="mb-4 md:mb-6 pb-3 border-b border-[#21364a]">
            <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
              <div className="bg-cyan-500/20 p-2 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="size-6  text-cyan-500" />
              </div>
              {t("game.leaderboard")}
            </h2>
          </div>

          {/* Header row */}
          <div className="mb-3 md:mb-5">
            <div className="bg-[#081C29] rounded-lg  p-3">
              <div className="grid grid-cols-[auto_1fr_auto] gap-6 text-[#a4aca7] text-xs md:text-sm">
                <div className="text-left pl-4">{t("game.rank")}</div>
                <div className="text-left pl-5">{t("game.player")}</div>
                <div className="text-right pr-10">{t("game.score")}</div>
              </div>
            </div>
          </div>

          {/* Scrollable container */}
          <div className="max-h-[500px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {leaderboard.map((player, index) => {
              const rankIndex = player.lvl > 1 ? player.lvl - 1 : 0
              return (
                <div
                  key={index}
                  onClick={() => router.push(`/profile?id=${player.id}`)}
                  className={`grid grid-cols-[auto_1fr_auto] cursor-pointer gap-1 p-3 md:p-4 m-2 rounded-lg    transition-all duration-300 items-center ${index === 0
                    ? " bg-cyan-500/20 hover:bg-cyan-700  border border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20"
                    : "hover:bg-cyan-500/30"
                    }`}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center ">
                      <img
                        src={achievementRank[rankIndex].image}
                        alt={`Rank ${player.username}`}
                        className="size-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div
                      className="w-6 h-6 md:w-8 md:h-8 rounded  items-center justify-center text-xs font-bold hidden"
                    >
                      {player.match_count}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-3 mr-1.5 pl-8">
                    <div className="relative cursor-pointer">
                      <div className="h-8 w-8 md:h-12 md:w-12 relative border-2 border-cyan-500 flex shrink-0 overflow-hidden rounded-full">
                        <img
                          src={getImageUrl(player.profile_image) || "/placeholder.svg"}
                          alt="Player avatar"
                          className="aspect-square h-full w-full object-cover "
                        />
                      </div>
                      {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#113a4b] animate-pulse" /> */}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`${index === 0 ? 'font-bold' : 'font-medium'} text-cyan-500     text-sm md:text-base truncate`}>@{player.username}</p>
                      <p className={`${index === 0 ? 'font-bold' : 'font-medium'} text-cyan-100 text-xs md:text-sm`}>lvl {player.lvl}</p>
                    </div>
                  </div>
                  <div className="text-right pr-6">
                    <p className={`${index === 0 ? 'text-cyan-500' : 'text-cyan-700'} font-bold text-sm md:text-lg`}>{player.score}</p>
                  </div>
                </div>
              );
            }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}