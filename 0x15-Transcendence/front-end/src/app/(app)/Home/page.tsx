"use client"
import { useContext, useEffect } from "react";
import StatesCards from "./states-crads";
import GameModes from "./game-modes";
import Leaderboard from "./leaderboard";
import { Monitor, Swords, Trophy } from "lucide-react";
import {useTranslation} from "react-i18next"
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useGame, useUser } from "@/app/types";
import { useRouter } from "next/navigation";

export default function GamingDashboard() {

  const { t, i18n } = useTranslation();
  const {user, setUser} = useUser();
  const router = useRouter();
  const {setOnline, isOnline} = useGame();

  // language
  console.log("Current language:", i18n.language);

  useEffect(() => {
    setOnline(false);
  }, []);

  const gameModes = [
    {
      action: () => {
        router.push('/matchmaking');
        setOnline(true);
      },
      title: t("game.headToHead"),
      description: t("game.headToHeadDescr"),
      image: "/images/head-head.png",
      buttonText: t("game.playNow"),
      icon: Swords,
    },
    {
      action: () => {
        router.push('/game/local/create');
      },
      title: t("game.localMatch"),
      description: t("game.playLocalMatch"),
      image: "/images/training1.png",
      buttonText: t("game.playNow"),
      icon: Monitor,
    },
    {
      action: () => {
        router.push('/game/mode/tournament');
      },
      title: t("game.tournament"),
      description: t("game.tournamentDescr"),
      image: "/images/f.png",
      buttonText: t("game.playNow"),
      icon: Trophy,
    },
  ]

  return (
    <AnimatePresence mode="wait">
          <Motion.div
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -50}}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.5
            }}
            className="flex pt-20 overflow-x-hidden">
              {/* Main Content */}
              <main className="flex-1 md:ml-20 p-4 md:p-6">
                {/* Stats Cards */}
                <StatesCards />
                {/* Game Modes */}
                <GameModes gameModes={gameModes}/>
                {/* Leaderboard and Friends - Side by Side */}
                <Leaderboard leaderboard={user.leaderboard} />
                {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8"> */}
                  {/* Leaderboard */}
                  {/* Friends */}
                  {/* <Friends friends={friends}/> */}
                {/* </div> */}
              </main>
          </Motion.div>
    </AnimatePresence>
  )
}