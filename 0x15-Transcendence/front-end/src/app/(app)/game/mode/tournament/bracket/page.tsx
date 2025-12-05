"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, CircleAlert, X } from 'lucide-react'
import { electric_blue, getImageUrl} from '@/app/Utils'
import { useSocket } from '@/context/SocketContext'
import { SocketEvents, useGame, User, useUser } from '@/app/types'
import { useRouter } from 'next/navigation'
import Confirmator from '@/app/(app)/components/Confirmator'
import { useTranslation } from 'react-i18next'
import { BiExit } from 'react-icons/bi'

const defaultUser: User = {
  id: 0,
  first_name: 'Default User',
  last_name: 'Default User',
  username: '',
  language: '',
  bio: '',
  cover: '',
  created_at: '',
  match_count: 0,
  win_count: 0,
  lose_count: 0,
  win_rate: 0,
  friends_count: 0,
  leaderboard: [],
  two_factor_enabled: false,
  email: '',
  rank: 0,
  lvl: 0,
  alias: '',
  isGoogleLogin: false,
  score: 0
}

interface Bracket {
  semifinals: User[];
  finals: User[];
  winner: User[];
}

const TournamentBracket: React.FC<{tournamentName: string}> = ({
  tournamentName = "TOURNAMENT"
}) => {
  const { t } = useTranslation();
  const router = useRouter()
  const [showQuitWarning, setShowQuitWarning] = useState(false)
  const {socket, isConnected} = useSocket()
  const [round, setRound] = useState(-1);
  const [bracket, setBracket] = useState<Bracket>({
    semifinals: [defaultUser, defaultUser, defaultUser, defaultUser],
    finals: [defaultUser, defaultUser],
    winner: [defaultUser]
  })


  useEffect(() => {

    if (!socket) return

    if ( !bracket.semifinals?.length) {
      router.back() ;
      return;
    }
    socket.emit(SocketEvents.tournament.bracket);

    socket.on(SocketEvents.tournament.bracket, async (data: Bracket, round) => {

      if (!data || (!data?.semifinals?.length && !data?.finals?.length)) {
        router.replace('/game/mode/tournament');
        return
      }
      setRound(round);
      setBracket(data);
    })

    return () => {
      socket?.off(SocketEvents.tournament.bracket)
    }
  }, [socket])

  const {user} = useUser();

  const PlayerCard = ({ player, className = "" }: { player: User | null, className?: string }) => {
    if (!player) {
      return (
        <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-[#0F1725] rounded-lg border border-[#00F5FF]/50 flex flex-col items-center justify-center ${className}`}>
          <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00F5FF]/70" />
        </div>
      )
    }

    let isWinner = false;
    let shouldBeDimmed = false;

    if (bracket?.finals?.some(f => f?.id === player.id) ) {
      shouldBeDimmed = false;
    } else if (bracket?.finals?.length === 2 && !bracket?.finals?.some(f => f?.id === player.id)) {
      shouldBeDimmed = true;
    }

    if (bracket?.winner?.some(w => w?.id === player.id)) {
      isWinner = true;
    } else if (bracket?.winner?.length === 1 && round > -6) {
      shouldBeDimmed = true;
    }
    return (
      <div className={`w-14 ${shouldBeDimmed && 'opacity-50'}  h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg border-2 overflow-hidden relative ${
        isWinner ? 'border-[#00F5FF] shadow-lg shadow-[#00F5FF]/20' :`border-[#00F5FF]/50 `
      } ${className}`}>
        <img
          src={getImageUrl(player.profile_image)}
          alt={player.username}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center bg-black/80 text-cyan-500 text-[10px] sm:text-xs py-0.5 sm:py-1">
          <div className='truncate max-w-full px-1 text-center font-semibold'>
            {player.id === user.id ? '(You)' : player.alias || player.username}
          </div>
        </div>
      </div>
    )
  }

  const ChampionBox = () => {
    const winner = bracket?.winner[0]
    return (
      <motion.div
        className="bg-[#0F1725] w-min rounded-lg border border-[#00F5FF]/50 flex flex-col items-center justify-center p-3 sm:p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text-center mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#00F5FF]">{t('game.champion')}</h3>
        </div>

        {winner ? (
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <img
              src={getImageUrl(winner.profile_image)}
              alt={winner.username}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover border-2 border-[#00F5FF]"
            />
            <span className="text-cyan-300 font-bold truncate max-w-24 px-2 text-xs sm:text-sm text-center">{winner.id === user.id ? '(You)' : winner.alias ?? winner.username}</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#1A2332] rounded-lg flex items-center justify-center border border-[#00F5FF]/30">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#00F5FF]/70" />
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen pt-16 md:pt-20 md:ml-20 bg-gradient-to-br bg ">
      {showQuitWarning && (
        <Confirmator
          title={t('game.quitTournament')}
          message={t('game.quitTournamentConfirmation')}
          onConfirm={() => {
            router.replace('/game/mode/tournament')
          }}
          onCancel={() => setShowQuitWarning(false)}
        />
      )}
      {
        user.id === bracket.winner[0]?.id && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#0F1725]/90 border border-[#00F5FF]/50 rounded-lg px-4 py-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#00F5FF]" style={{color: electric_blue}} />
            <span className="text-[#00F5FF] font-semibold">{t('game.congratulationsYouAreTheChampion')}</span>
          </div>
        )
      }

      <div className="relative flex flex-col w-full items-center justify-start p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <motion.div
          className="flex flex-row gap-3 sm:gap-4 items-center pb-6 sm:pb-8 pt-4 sm:pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#00F5FF]" style={{color: electric_blue}} />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{color: electric_blue}}>
            {tournamentName}
          </h1>
        </motion.div>

        {/* Tournament Bracket Container */}
        <div className="w-full h-full flex px-4 sm:px-8 md:px-12 justify-center items-center">
          <div className="rounded-lg w-full max-w-6xl bg-[#0F1725] h-min border border-[#00F5FF]/50 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-auto">

            {/* Desktop Layout (md and up) */}
            <div className="hidden md:block">
              <div className="grid grid-cols-5 gap-4 lg:gap-6 xl:gap-8 items-center min-h-[400px]">

                {/* Column 1: Semifinal Players */}
                <div className="flex flex-col justify-center space-y-8 lg:space-y-12 xl:space-y-16">
                  <div className="space-y-2">
                    <PlayerCard player={bracket?.semifinals[0] ?? defaultUser} />
                    <PlayerCard player={bracket?.semifinals[1] ?? defaultUser} />
                  </div>
                  <div className="space-y-2">
                    <PlayerCard player={bracket?.semifinals[2] ?? defaultUser} />
                    <PlayerCard player={bracket?.semifinals[3] ?? defaultUser} />
                  </div>
                </div>

                {/* Column 2: Left Connecting Lines */}
                <div className="flex flex-col justify-center relative h-full">
                  <div className="flex flex-col justify-center relative h-full">
                    <div className="relative h-full flex items-center">
                      <div className="absolute left-0 top-1/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-0 top-2/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 lg:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 lg:left-8 top-1/2 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center relative h-full">
                    <div className="relative h-full flex items-center">
                      <div className="absolute left-0 top-1/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-0 top-2/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 lg:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 lg:left-8 top-1/2 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Final Players */}
                <div className="flex flex-col justify-center space-y-16 lg:space-y-20 xl:space-y-24">
                  <PlayerCard player={bracket?.finals[0] ?? defaultUser} />
                  <PlayerCard player={bracket?.finals[1] ?? defaultUser} />
                </div>

                {/* Column 4: Right Connecting Lines */}
                <div className="flex flex-col justify-center relative h-full">
                  <div className="relative h-full flex items-center">
                    <div className="absolute left-0 top-1/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                    <div className="absolute left-0 top-2/3 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                    <div className="absolute left-6 lg:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                    <div className="absolute left-6 lg:left-8 top-1/2 w-6 lg:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                  </div>
                </div>

                {/* Column 5: Champion */}
                <div className="flex flex-col justify-center items-center">
                  <ChampionBox />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Layout (below md) */}
            <div className="md:hidden">
              <div className="flex flex-col items-center space-y-6 sm:space-y-8">

                {/* Semifinals */}
                <div className="w-full">
                  <h3 className="text-sm sm:text-base font-bold text-[#00F5FF] mb-3 sm:mb-4 text-center">{t('game.semifinals')}</h3>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <PlayerCard player={bracket?.semifinals[0] ?? defaultUser} />
                      <div className="text-[#00F5FF] text-xs sm:text-sm font-semibold">{t('game.vs')}</div>
                      <PlayerCard player={bracket?.semifinals[1] ?? defaultUser} />
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <PlayerCard player={bracket?.semifinals[2] ?? defaultUser} />
                      <div className="text-[#00F5FF] text-xs sm:text-sm font-semibold">{t('game.vs')}</div>
                      <PlayerCard player={bracket?.semifinals[3] ?? defaultUser} />
                    </div>
                  </div>
                </div>

                {/* Arrow Down */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 sm:h-8 bg-[#00F5FF]/50"></div>
                  <div className="w-3 h-3 border-l-2 border-b-2 border-[#00F5FF]/50 rotate-[-45deg] translate-y-[-12px]"></div>
                </div>

                {/* Finals */}
                <div className="w-full">
                  <h3 className="text-sm sm:text-base font-bold text-[#00F5FF] mb-3 sm:mb-4 text-center">{t('game.finals')}</h3>
                  <div className="flex justify-center items-center space-x-4 sm:space-x-6">
                    <PlayerCard player={bracket?.finals[0] ?? defaultUser} />
                    <div className="text-[#00F5FF] text-xs sm:text-sm font-semibold">{t('game.vs')}</div>
                    <PlayerCard player={bracket?.finals[1] ?? defaultUser} />
                  </div>
                </div>

                {/* Arrow Down */}
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 sm:h-8 bg-[#00F5FF]/50"></div>
                  <div className="w-3 h-3 border-l-2 border-b-2 border-[#00F5FF]/50 rotate-[-45deg] translate-y-[-12px]"></div>
                </div>

                {/* Champion */}
                <div className="w-full flex items-center justify-center max-w-xs">
                  <ChampionBox />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
              onClick={() => setShowQuitWarning(true)}
              className="rounded-lg gap-2 my-10 border font-bold flex items-center justify-center border-none w-full max-w-sm transition-all duration-300 py-3 text-red-500/80 hover:bg-red-500/20 cursor-pointer">
                <X className='rotate-180'/>
              {t('game.quitTournament')}
            </button>
        <div className=" flex gap-2 justify-center items-center  w-full flex-col bottom-16  px-4 sm:px-6 md:px-12 lg:px-16">
          <div className='flex flex-col gap-4 '>
            <div className='text-center flex gap-2 flex-row xl:gap-2 text-[#b0b0b0]'><CircleAlert/>{t('game.onceLeavePageQuitTournament')}</div>
            <div className='text-center flex gap-2 flex-row xl:gap-2 text-[#b0b0b0]'><CircleAlert/>{t('game.playersWillAppearOnceJoined')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentBracket