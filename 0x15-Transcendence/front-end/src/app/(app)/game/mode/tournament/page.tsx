"use client"
import { useState, useRef, useEffect, SetStateAction, useContext } from "react";
import HeroSection from "./hero-section";
import JoinSection from "./join-section";
import { useSocket } from "@/context/SocketContext";
import { range, set } from "lodash";
import { fetchWithToken } from "@/app/Utils";
import { baseUrl, Motion, SocketEvents, useUser } from "@/app/types";
import { Tournament } from "@/app/types";
import { UserContext } from "@/app/types";
import {toast} from "@/hooks/use-toast";
import { CircleAlert, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import AliasInput from "@/app/(app)/components/AliasInput";
import { AnimatePresence } from "framer-motion";


export default function TournamentOverview() {
  const { t } = useTranslation();
  const [isCreate, setIsCreate] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentDate, setTournamentDate] = useState("");
  const cancelCreate = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const [isCreating, setCreating] = useState(false);
  // Load tournaments from localStorage on component mount


  const [alias, setAlias] = useState("");
  const [showAliasDialog, setShowAliasDialog] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  const getTournaments = async () => {
    try {
      const { tournaments } = await fetchWithToken(
        `${baseUrl}/api/game/tournaments`,
        {
          method: 'GET',
        }
      ).then (data => data.json());
      setTournaments(tournaments ?? []);
    } catch (error) {
    }
  }


  useEffect(() => {
    const fetchTournaments = async () => {
      await getTournaments();
    }

    fetchTournaments()
    sessionStorage.removeItem('matches');
    sessionStorage.removeItem('winners');
    return () => {
      // clearInterval(interval)
    }
  }, []);

  const {user} = useUser();


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cancelCreate.current && !cancelCreate.current.contains(e.target as Node)) {
        setIsCreate(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, []);

  useEffect(() => {
      if (!socket || socket?.hasListeners(SocketEvents.tournament.create)) return; // Prevent multiple listeners

      // Listen for tournament creation events
      socket.on(SocketEvents.tournament.create, async (tournament) => {
        console.log('Received tournament creation event:', tournament);
        setTournaments((prevTournaments) => [...prevTournaments, tournament]);
        setIsCreate(false);
      });
  }, [socket]);

  return (
    <div>
      <div className="flex pt-20 ">
        <main className="flex-1 md:ml-20 p-4 md:p-6 overflow-x-auto space-y-8">
          <HeroSection setIsCreate = {setIsCreate}/>
          <JoinSection
            setSelectedTournament={setSelectedTournament}
            onReload={async () => await getTournaments()}
            tournaments={tournaments} setTournaments={setTournaments}
          />
        </main>
        {
          <AnimatePresence mode="wait">
              {
                selectedTournament &&
                <AliasInput
                  onCreate={(alias: string) => {
                    setShowAliasDialog(false);
                    if (selectedTournament) {
                      socket?.emit(SocketEvents.tournament.join, selectedTournament.id, alias);
                    }
                  }}
                  onCancel={() => setSelectedTournament(null)}
                />
              }
          </AnimatePresence>
        }
      {
        isCreate &&
          <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={cancelCreate} className="w-full max-w-md  px-6 flex flex-col  justify-center rounded-lg bg-gradient-to-br bg-dark backdrop-blur-sm border border-[#21364a] hover:border-[#23ccdc]/30">
            <div className="flex justify-between items-center mb-6 mt-6">
              <h2 className="font-bold text-xl text-cyan-500">{t('game.createTournament')}</h2>
            </div>

            <div className="mb-6 ">
              <label className="block text-[#a4aca7] text-sm mb-2">{t('game.tournamentName')}</label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  maxLength={20}
                  minLength={3}
                  placeholder={t('game.enterTournamentName')}
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full p-3 bg-[#113A4B]/50 border border-[#498195]/30 rounded-md text-white focus:outline-none focus:border-[#23ccdc]  transition-all"
                />
              </div>
            </div>
            <div className="mb-6">
                <label className="block text-[#a4aca7] text-sm mb-2">Alias name</label>
                <input
                  type="text"
                  maxLength={12}
                  minLength={3}
                  placeholder={"Enter your alias name"}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full p-3 bg-[#113A4B]/50 border border-[#498195]/30 rounded-md text-white focus:outline-none focus:border-[#23ccdc]  transition-all"
                />
              </div>
            <div className="flex flex-row justify-center items-center  gap-2 mb-2">
              <button
                className="rounded-lg transition-all duration-300 w-full hover:bg-cyan-500/20  py-3 "
                onClick={() => setIsCreate(false)}>
                {t('game.cancel')}
              </button>
              <button
                onClick={() => {
                  console.log('Creating tournament');
                  console.log(`tournamentName: ${tournamentName}, alias: ${alias}`);
                  socket?.emit(SocketEvents.tournament.create, tournamentName.trim(), user.id, alias.trim());
                }}
                disabled={tournamentName.trim().length < 3 && alias.trim().length < 3}
                className={`rounded-lg border font-bold flex items-center justify-center border-none w-full transition-all duration-300 py-3 ${
                  tournamentName.trim().length >= 3 && alias.trim().length >= 3
                    ? "text-cyan-500/80 hover:bg-cyan-500/20  cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}>
                {
                  isCreating ? <Loader className="animate-spin"/> : t('game.create')
                }
              </button>
            </div>
          </div>
        </div>
      }
      </div>
    </div>
  );
}
