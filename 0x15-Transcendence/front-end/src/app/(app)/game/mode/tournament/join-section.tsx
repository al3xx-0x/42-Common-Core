import React, { useContext, useRef } from "react"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Loader, RefreshCcw, Search, SquareChevronLeft, SquareChevronRight, Trophy, Users } from "lucide-react";
import { SocketEvents, Tournament, UserContext, useUser } from "@/app/types";
import { useSocket } from "@/context/SocketContext";
import { fetchWithToken } from "@/app/Utils";
import { baseUrl } from "@/app/types";
import { useTranslation } from "react-i18next";

interface JoinSectionProps {
  tournaments: Tournament[];
  setTournaments: React.Dispatch<React.SetStateAction<Tournament[]>>;
  setSelectedTournament: React.Dispatch<React.SetStateAction<Tournament | null>>;
  onReload: () => Promise<void>
}

export default function JoinSection({ tournaments, setTournaments, setSelectedTournament, onReload }: JoinSectionProps) {
  const { t } = useTranslation();
  const [featuredTournaments, setFeaturedTournaments] = useState<Tournament[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loadingTournaments, setLoadingTournaments] = useState(false);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);


  useEffect(() => {
    setFeaturedTournaments(tournaments);
  }, [tournaments]);

  const scrollRef = useRef<HTMLDivElement | null>(null);


  const { socket } = useSocket();

  const scrollAmount = 300;

  const handlePrevious = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (!searchInput) {
      setFeaturedTournaments(tournaments);
      return;
    }
    searchTournaments();
  }, [searchInput]);

  const searchTournaments = async () => {
    const response = await fetchWithToken (
      `${baseUrl}/api/game/tournaments/search?name=${encodeURIComponent(searchInput)}`,
      {
        method: 'GET'
      }
    );
    const data = await response.json();
    setFeaturedTournaments(data)
  }


  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkVisibility = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Initial check
    checkVisibility();

    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(checkVisibility);
    resizeObserver.observe(container);

    // Listen to scroll events
    container.addEventListener('scroll', checkVisibility, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', checkVisibility);
    };
  }, [featuredTournaments]);

  return (
    <div className="relative w-full max-w-none  overflow-x-auto scrollbar-hide rounded-lg bg-[#081C29]/80 border border-[#21364a] hover:border-[#23ccdc]/30">
      <div className="  flex flex-row gap-6 p-3 md:p-4 items-center border-b border-[#21364a] justify-between">
        <div className=" flex flex-row  justify-center items-center">
          <div className="bg-cyan-500/20 items-center rounded-lg p-2 mr-3 flex justify-center">
            <Trophy className="h-4 w-4 md:h-5 md:w-5 text-cyan-500" />
          </div>
          <h2 className="text-lg font-semibold text-white flex items-center">
            {t('game.tournaments')}
          </h2>
        </div>
        <div className=" w-full  flex  items-center justify-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a4aca7] h-4 w-4" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('game.search')}
              className="rounded-full pl-10 w-full  h-7 md:h-10  bg-[#081C29]/80 border focus:outline-none border-[#D9D9D9]/20 text-white focus:border-[#498195]/70 focus-visible:ring-0"
            />
          </div>
          </div>
        <button
          onClick={async () => {
            setLoadingTournaments(true);
            await onReload();
            await setTimeout(() => {
              setLoadingTournaments(false);
            }, 1000)
          }}
          className={`bg-cyan-500/20 rounded-full ${loadingTournaments && 'animate-spin'} h-min p-2 text-cyan-500`}><RefreshCcw size={20} className="-scale-x-100"/> </button>
      <div/>
      </div>
      {
        showLeftArrow && (
          <button onClick={handlePrevious} className="top-1/2 -translate-y-1/2 px-2  text-cyan-500 absolute left-2  bg-cyan-500/20 h-24 z-20 rounded-full backdrop-blur-sm hover:bg-cyan-500/30 "><ChevronLeft/></button>
        )
      }
      {
        showRightArrow && (
          <button onClick={handleNext} className="p-2 absolute  text-cyan-500 right-2 top-1/2 -translate-y-1/2 bg-cyan-500/20 h-24 z-20 rounded-full backdrop-blur-sm hover:bg-cyan-500/20 "><ChevronRight/></button>
        )
      }

      <div
      ref={scrollRef}
      className="flex gap-6 p-4 items-center  scrollbar-hide  overflow-x-auto scrollbar-thin scroll-smooth scrollbar-track-slate-800 scrollbar-thumb-slate-600">
        {!featuredTournaments || featuredTournaments.length === 0 ? (
          <div className="w-full col-span-full text-center py-12">
            <div className="text-[#A4ACA7] text-lg mb-4">{t('game.noTournamentsAvailable')}</div>
            <div className="text-[#A4ACA7] text-sm">{t('game.createNewTournamentToGetStarted')}</div>
          </div>
        ) : (
          featuredTournaments.map((tournament, i) => {
            const isFull = tournament.players_count >= 4;
            const progress = (tournament.players_count / 4) * 100;
            const handleJoin = () => {
              if (!isFull) {
                setSelectedTournament(tournament);
              }
            }

            return (
              <div
                key={i}
                className="min-w-[300px] bg-gradient-to-br  from-cyan-950 via-cyan-800/20 to-cyan-950 rounded-xl p-6 border border-[#21364a] hover:border-[#23ccdc]/50 transition-all duration-300  hover:shadow-lg hover:shadow-[#23ccdc]/10"
              >
                <div className="flex  flex-row mb-3 items-center justify-between">
                  <h2 className="font-semibold text-xl  text-white whitespace-nowrap overflow-hidden text-ellipsis">{tournament.name}</h2>
                  <p className={`
                           rounded-full px-3 py-1 text-xs font-medium border
                          ${isFull
                      ? "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/50"
                      : "text-[#00F5FF] bg-[#00F5FF]/10 border-[#00F5FF]/50"
                    }`}>
                    {isFull ? t('game.full') : t('game.available')}
                  </p>
                </div>
                <div className="text-2xl font-bold text-[#339AF0] mb-6">{tournament.prize_value}</div>
                <div className="flex flex-col text-[#A4ACA7] gap-1.5">
                  <div className="flex flex-row items-center gap-2">
                    <Users className="h-4 w-4" />
                    <p className="text-[14px]">{tournament.players_count}/{4} {t('game.players')}</p>
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <p className="text-[14px]">{tournament.time}</p>
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <div className="flex text-[#A4ACA7] text-[14px] items-center justify-between mb-2">
                    <p>{t('game.progress')}</p>
                    <p>{progress}%</p>
                  </div>
                  <div className="bg-[#D2D2D2]/20 w-full h-2 rounded-lg mb-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00F5FF] to-[#23ccdc] h-2 rounded-lg transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <button
                    disabled={isFull}
                    className={`
                            rounded-lg px-4 py-3 font-medium text-white transition-all duration-300
                            ${isFull
                        ? "bg-[#707070]/20 text-gray-500 cursor-not-allowed "
                        : "bg-cyan-700  hover:bg-cyan-500 border border-cyan-400"
                      }
                            `}
                    onClick={() => handleJoin()}
                  >
                    {isFull ? t('game.tournamentFull') : t('game.joinTournament')}

                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}