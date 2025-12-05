import { CircleCheck, CircleX, History } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { baseUrl, UserContext, useUser } from "@/app/types";
import { fetchWithToken, getImageUrl } from "@/app/Utils";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

interface GameResult {
    id: number;
    player: string;
    opponent: string;
    playerProfile: string;
    opponentProfile: string;
    score: number;
    opponentScore: number;
    result: number; // 1 = win, 0 = loss, 2 = draw
    date: string;
    xp: number;
    playerlevel: number;
    opponentlevel: number;
}

export default function GameHistory(){
    const { t } = useTranslation();
    const [gameResults, setGameResults] = useState<GameResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useSearchParams();
    const {user} = useUser();

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user ID from URL params or use current user
                const urlId = params.get("id");
                const targetId = urlId ? Number(urlId) : user.id;

                const response = await fetchWithToken(
                    `${baseUrl}/api/game/history?id=${targetId}`,
                    {
                        method: "GET",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setGameResults(data.games || []);
                } else {
                    setError("Failed to load game history");
                }
            } catch (err) {
                console.error("Error fetching game history:", err);
                setError("An error occurred while loading game history");
            } finally {
                setLoading(false);
            }
        };

        if (user.id) {
            fetchGameHistory();
        }
    }, [params, user.id]);

    return (
        <div className="bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30 rounded-lg w-full h-full">
            <div className="p-3 md:p-4 h-full w-full flex flex-col">
                <div className="pb-3 border-b border-[#21364a]">
                    <div className="flex flex-row items-center">
                        <div className="bg-cyan-500/20 p-2 rounded-lg flex items-center justify-center mr-2">
                            <History className="h-4 w-4 md:h-5 md:w-5  text-cyan-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            {t('profile.gameHistory') || 'Game History'}
                        </h2>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="text-[#23ccdc] text-lg">{t('profile.loading') || 'Loading...'}</div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="text-red-400 text-lg">{error}</div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && gameResults.length === 0 && (
                    <div className="flex justify-center items-center h-[300px]">
                        <div className="text-[#a4aca7] text-lg">
                            {t('profile.noGamesFound') || 'No games played yet'}
                        </div>
                    </div>
                )}

                {/* Games List */}
                {!loading && !error && gameResults.length > 0 && (
                    <div className="flex flex-col justify-center px-1 h-full w-full mt-3">
                        <div className="max-h-[300px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1 space-y-3 md:space-y-4">
                            {gameResults.map((result, index) => (
                                <div key={result.id || index}>
                                    <div className="flex flex-col bg-gradient-to-tr bg-cyan-950 hover:bg-cyan-800 transition-all duration-300 rounded-lg items-center justify-center p-2 md:p-4 gap-2 w-full h-full">
                                        <div className="flex justify-between w-full h-full">
                                            {/* Date and XP Section */}
                                            <div className="flex flex-col items-center justify-center">
                                                <div>
                                                    <h2 className="text-slate-400 font-medium md:text-sm text-[11px]">{result.date}</h2>
                                                </div>
                                                <div className="">
                                                    {result.result === 1 ? (
                                                        <p className="text-cyan-500 font-bold md:text-[16px] text-[11px]">{`+${result.xp} XP`}</p>
                                                    ) : result.result === 0 ? (
                                                        <p className="text-[#FF6B6B] font-bold md:text-[16px] text-[11px]">{`+${result.xp} XP`}</p>
                                                    ) : (
                                                        <p className="text-slate-400 font-bold md:text-[16px] text-[11px]">DRAW</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-px h-12 bg-[#475569]"></div>

                                            {/* Players Section */}
                                            <div className="flex justify-center items-center gap-3 md:gap-5">
                                                {/* Current Player */}
                                                <div className="flex justify-center items-center md:gap-3 gap-1.5">
                                                    <img
                                                        src={getImageUrl(result.playerProfile)}
                                                        alt={result.player}
                                                        className="rounded-xl md:h-12 md:w-12 h-10 w-10 border-2 border-[#06b6d4] object-cover"
                                                    />
                                                    <div className="">
                                                        <h2 className="font-medium truncate max-w-32 md:text-[14px] text-[11px]">{result.player}</h2>
                                                        {/* <p className="text-slate-400 font-medium md:text-sm text-[10px]">{`Level ${res}`}</p> */}
                                                    </div>
                                                </div>

                                                {/* Score Display */}
                                                <div className={`bg-[#30D9DC] p-0.5 rounded-md md:w-20 w-10 flex`}>
                                                    <div className={`flex justify-between md:text-2xl items-center bg-black w-full rounded-[5px] px-1 md:px-3 font-bold`}>
                                                        <span style={{color: result.result === 1 ? '#00FF55' : result.result === 0 ? '#FF6B6B' : '#94a3b8'}}>
                                                            {result.score}
                                                        </span>
                                                        <div className='bg-[#30D9DC] w-0.5 h-full'/>
                                                        <span style={{color: result.result === 0 ? '#00FF55' : result.result === 1 ? '#FF6B6B' : '#94a3b8'}}>
                                                            {result.opponentScore}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Opponent */}
                                                <div className="flex justify-center items-center  md:gap-3 gap-1.5">
                                                    <div>
                                                        <h2 className="font-medium truncate max-w-32  md:text-[14px] text-[11px]">{result.opponent}</h2>
                                                        {/* <p className="text-slate-400 font-medium md:text-sm text-[10px]">{`Level ${result.opponentlevel}`}</p> */}
                                                    </div>
                                                    <img
                                                        src={getImageUrl(result.opponentProfile)}
                                                        alt={result.opponent}
                                                        className="rounded-xl md:h-12 md:w-12 h-10 w-10 border-2 border-[#06b6d4] object-cover"
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-px h-12 bg-[#475569]"></div>

                                            {/* Result Icon */}
                                            <div className="flex justify-center items-center">
                                                {result.result === 1 ? (
                                                    <CircleCheck className="md:h-10 md:w-10 h-8 w-8 text-cyan-500"/>
                                                ) : result.result === 0 ? (
                                                    <CircleX className="md:h-10 md:w-10 h-8 w-8 text-[#FF6B6B]"/>
                                                ) : (
                                                    <div className="md:h-10 md:w-10 h-8 w-8 flex items-center justify-center text-slate-400 font-bold text-xs">
                                                        =
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}