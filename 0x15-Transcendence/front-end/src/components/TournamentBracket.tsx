"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ArrowLeft, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { electric_blue } from '@/app/Utils'
import { useTranslation } from 'react-i18next'

interface Player {
  id: string
  name: string
  avatar: string
  score?: number
}

interface Match {
  id: string
  player1: Player | null
  player2: Player | null
  winner?: Player | null
  round: string
  status: 'pending' | 'in-progress' | 'completed'
}

interface TournamentBracketProps {
  tournamentName?: string
  players?: Player[]
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({tournamentName = ""}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showQuitWarning, setShowQuitWarning] = useState(false)
  const [currentTournament, setCurrentTournament] = useState<any>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tournamentData = localStorage.getItem('currentTournament');
      if (tournamentData) {
        try {
          const parsed = JSON.parse(tournamentData);
          setCurrentTournament(parsed);

          const newMatches = generateDynamicMatches(parsed);
          setMatches(newMatches);
        } catch (error) {
          console.error('Error parsing tournament data:', error);
        }
      }
    }
  }, []);

  const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData') || localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return {
            id: user.id || 'user1',
            name: user.name || user.username || 'YOU',
            avatar: user.avatar || user.profilePicture || '/images/default-avatar.png'
          };
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return {
      id: 'user1',
      name: 'YOU',
      avatar: '/images/default-avatar.png'
    };
  };

  const [matches, setMatches] = useState<Match[]>([]);

  const generateDynamicMatches = (tournamentData?: any) => {
    const user = getCurrentUser();

    const mockPlayers = [
      { id: '2', name: 'PLAYER 2', avatar: '/images/avatar1-Photoroom.png' },
      { id: '3', name: 'PLAYER 3', avatar: '/images/avatar2-Photoroom.png' },
      { id: '4', name: 'PLAYER 4', avatar: '/images/avatar3-Photoroom.png' }
    ];

    return [
      {
        id: 'semi1',
        player1: user, 
        player2: mockPlayers[0],
        round: 'semifinals',
        status: 'pending' as const,
        winner: null
      },
      {
        id: 'semi2',
        player1: mockPlayers[1],
        player2: mockPlayers[2],
        round: 'semifinals',
        status: 'pending' as const,
        winner: null
      },
      {
        id: 'final',
        player1: null,
        player2: null, 
        round: 'finals',
        status: 'pending' as const,
        winner: null
      }
    ];
  };

  useEffect(() => {
    const initialMatches = generateDynamicMatches();
    setMatches(initialMatches);
  }, []);

  const PlayerCard = ({ player, isWinner = false, className = "" }: { player: Player | null, isWinner?: boolean, className?: string }) => {
    if (!player) {
      return (
        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#0F1725] rounded-lg border border-[#00F5FF]/50 flex flex-col items-center justify-center ${className}`}>
          <Users size={12} className="text-[#00F5FF]/70 mb-1 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span className="text-[#00F5FF]/70 text-xs">TBD</span>
        </div>
      )
    }

    return (
      <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg border-2 overflow-hidden relative ${
        isWinner
          ? 'border-[#00F5FF] shadow-lg shadow-[#00F5FF]/20'
          : 'border-[#00F5FF]/50'
      } ${className}`}>
        <img
          src={player.avatar}
          alt={player.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs text-center py-1">
          {player.name}
        </div>
        {isWinner && (
          <div className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-[#00F5FF] rounded-full flex items-center justify-center">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    )
  }

  const MatchBox = ({ className = "" }: { className?: string }) => {
    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-[#0F1725] rounded-lg border border-[#00F5FF]/50 ${className}`}>
      </div>
    )
  }

  const ConnectorLine = ({ direction = 'horizontal', className = "" }: { direction?: 'horizontal' | 'vertical' | 'corner', className?: string }) => {
    if (direction === 'horizontal') {
      return <div className={`h-0.5 bg-[#00F5FF]/50 ${className}`} />
    }
    if (direction === 'vertical') {
      return <div className={`w-0.5 bg-[#00F5FF]/50 ${className}`} />
    }
    // Corner connector
    return (
      <div className={`${className}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 0 50 L 50 50 L 50 0"
            stroke="#00F5FF"
            strokeWidth="2"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>
    )
  }

  const TrophySection = () => {
    const winner = matches.find(m => m.round === 'finals')?.winner

    return (
      <motion.div
        className="flex flex-col items-center justify-center space-y-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Trophy
            size={60}
            className="text-[#00F5FF] drop-shadow-lg filter"
          />
          <motion.div
            className="absolute inset-0 bg-[#00F5FF]/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    )
  }

  const ChampionBox = () => {
    const winner = matches.find(m => m.round === 'finals')?.winner

    return (
      <motion.div
        className="w-32 h-40 xl:w-40 xl:h-48 bg-[#0F1725] rounded-lg border border-[#00F5FF]/50 flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-[#00F5FF] mb-2">CHAMPION</h3>
        </div>

        {winner ? (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <img
              src={winner.avatar}
              alt={winner.name}
              className="w-16 h-16 rounded-lg object-cover mb-3 border-2 border-[#00F5FF]"
            />
            <span className="text-white font-bold text-sm text-center">{winner.name}</span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#1A2332] rounded-lg mb-3 flex items-center justify-center border border-[#00F5FF]/30">
              <Trophy size={24} className="text-[#00F5FF]/70" />
            </div>
            <span className="text-[#00F5FF]/70 text-sm">TBD</span>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-screen pt-20 md:ml-20">
      <div className="flex m-5 flex-col w-full items-center border _border justify-between bg-[#081C29]/70 rounded-lg">
        {/* Header */}
        <motion.div
          className="pt-16 flex flex-row gap-4 items-center pb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy size={48} className="text-[#00F5FF]" style={{color: electric_blue}} />
          <h1 className="text-3xl font-bold" style={{color: electric_blue}}>
            {currentTournament?.tournament?.title || tournamentName || t('game.tournament').toUpperCase()}
          </h1>
        </motion.div>

        {/* Tournament Bracket Content */}
        <div className="flex top-1/2 bottom-1/2 h-full flex-row justify-between w-full items-center">
          <div className="flex flex-col w-full items-center px-8 gap-8">

            {/* Tournament Bracket */}
            <div className="w-full rounded-lg bg-[#0F1725] border border-[#00F5FF]/50 p-2 sm:p-4 md:p-6 lg:p-8">
              {/* Mobile Layout - Vertical Stack */}
              <div className="block md:hidden">
                <div className="space-y-6">
                  {/* Semifinals */}
                  <div className="space-y-4">
                    <h3 className="text-[#00F5FF] text-center font-semibold">Semifinals</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          {matches[0] && matches[0].player1 && (
                            <PlayerCard
                              player={matches[0].player1}
                              isWinner={matches[0].winner?.id === matches[0].player1?.id}
                            />
                          )}
                          {matches[0] && matches[0].player2 && (
                            <PlayerCard
                              player={matches[0].player2}
                              isWinner={matches[0].winner?.id === matches[0].player2?.id}
                            />
                          )}
                        </div>
                        <div className="mx-2">→</div>
                        <MatchBox className="w-20 h-12" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          {matches[1] && matches[1].player1 && (
                            <PlayerCard
                              player={matches[1].player1}
                              isWinner={matches[1].winner?.id === matches[1].player1?.id}
                            />
                          )}
                          {matches[1] && matches[1].player2 && (
                            <PlayerCard
                              player={matches[1].player2}
                              isWinner={matches[1].winner?.id === matches[1].player2?.id}
                            />
                          )}
                        </div>
                        <div className="mx-2">→</div>
                        <MatchBox className="w-20 h-12" />
                      </div>
                    </div>
                  </div>

                  {/* Finals */}
                  <div className="space-y-4">
                    <h3 className="text-[#00F5FF] text-center font-semibold">Finals</h3>
                    <div className="flex justify-center">
                      <MatchBox className="w-24 h-16" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[#00F5FF] text-center font-semibold">Champion</h3>
                    <div className="flex justify-center">
                      <TrophySection />
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block lg:hidden">
                <div className="grid grid-cols-3 gap-4 items-center min-h-[300px]">
                  <div className="flex flex-col justify-center space-y-8">
                    <div className="space-y-1">
                      {matches[0] && matches[0].player1 && (
                        <PlayerCard
                          player={matches[0].player1}
                          isWinner={matches[0].winner?.id === matches[0].player1?.id}
                        />
                      )}
                      {matches[0] && matches[0].player2 && (
                        <PlayerCard
                          player={matches[0].player2}
                          isWinner={matches[0].winner?.id === matches[0].player2?.id}
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      {matches[1] && matches[1].player1 && (
                        <PlayerCard
                          player={matches[1].player1}
                          isWinner={matches[1].winner?.id === matches[1].player1?.id}
                        />
                      )}
                      {matches[1] && matches[1].player2 && (
                        <PlayerCard
                          player={matches[1].player2}
                          isWinner={matches[1].winner?.id === matches[1].player2?.id}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-8">
                    <div className="space-y-6">
                      <MatchBox className="w-24 h-16" />
                      <MatchBox className="w-24 h-16" />
                    </div>
                    <div className="text-[#00F5FF]">↓</div>
                    <MatchBox className="w-28 h-18" />
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <TrophySection />
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-5 gap-4 xl:gap-6 items-center min-h-[400px]">
                  <div className="flex flex-col justify-center space-y-8 xl:space-y-12">
                    <div className="space-y-2">
                      {matches[0] && matches[0].player1 && (
                        <PlayerCard
                          player={matches[0].player1}
                          isWinner={matches[0].winner?.id === matches[0].player1?.id}
                        />
                      )}
                      {matches[0] && matches[0].player2 && (
                        <PlayerCard
                          player={matches[0].player2}
                          isWinner={matches[0].winner?.id === matches[0].player2?.id}
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      {matches[1] && matches[1].player1 && (
                        <PlayerCard
                          player={matches[1].player1}
                          isWinner={matches[1].winner?.id === matches[1].player1?.id}
                        />
                      )}
                      {matches[1] && matches[1].player2 && (
                        <PlayerCard
                          player={matches[1].player2}
                          isWinner={matches[1].winner?.id === matches[1].player2?.id}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center relative h-full">
                    <div className="flex flex-col justify-center relative h-full">
                        <div className="relative h-full flex items-center">
                        <div className="absolute left-0 top-1/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-0 top-2/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-6 xl:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-6 xl:left-8 top-1/2 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center relative h-full">
                        <div className="relative h-full flex items-center">
                        <div className="absolute left-0 top-1/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-0 top-2/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-6 xl:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                        <div className="absolute left-6 xl:left-8 top-1/2 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                        </div>
                    </div>
                    </div>

                  <div className="flex flex-col justify-center space-y-16 xl:space-y-24">
                    <MatchBox />
                    <MatchBox />
                  </div>

                  <div className="flex flex-col justify-center relative h-full">
                    <div className="relative h-full flex items-center">
                      <div className="absolute left-0 top-1/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-0 top-2/3 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 xl:left-8 top-1/3 w-0.5 h-1/3 bg-[#00F5FF]/50"></div>
                      <div className="absolute left-6 xl:left-8 top-1/2 w-6 xl:w-8 h-0.5 bg-[#00F5FF]/50"></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-4">
                    <TrophySection />
                    <ChampionBox />
                  </div>

                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full">
              <button
                onClick={() => setShowQuitWarning(true)}
                className="p-3 border transition-colors duration-200 font-semibold hover:bg-white/5 bg-[#0F1725] w-full md:max-w-56 cursor-pointer border-red-500/50 rounded-lg hover:border-red-400"
              >
                <div className="flex flex-row justify-center items-center gap-4">
                  <ArrowLeft size={20} className="text-red-400" />
                  <span className="text-red-400">{t('game.quitTournamentTitle')}</span>
                </div>
              </button>
            </div>

          </div>
        </div>
        <div className="h-10" />
      </div>
      {showQuitWarning && (
        <div className="fixed backdrop-blur px-[5vw] md:px-[30vw] inset-0 z-40 p-4 flex items-center justify-center bg-black/60">
          <motion.div
            className='bg-dark _border w-full rounded-lg p-6 flex flex-col gap-4 shadow-lg min-w-[300px]'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{color: electric_blue}}>{t('game.quitTournamentTitle')}</h2>
            <p className="text-xl text-white">{t('game.quitTournamentMessage')}</p>
            <p className="mb-4 text-xl text-gray-500">{t('game.quitTournamentWarning')}</p>

            <div className="flex justify-between gap-2">
              <button
                className="px-4 py-2 flex-1 rounded hover:bg-gray-700 transition-colors duration-500 text-white"
                onClick={() => setShowQuitWarning(false)}
              >
                {t('game.cancel')}
              </button>
              <button
                className="px-4 py-2 flex justify-center flex-1 rounded text-red-500 hover:bg-red-500/20 transition-colors duration-500"
                onClick={() => {
                  if (currentTournament && typeof window !== 'undefined') {
                    const tournaments = localStorage.getItem('tournaments');
                    if (tournaments) {
                      try {
                        const parsedTournaments = JSON.parse(tournaments);
                        const updatedTournaments = [...parsedTournaments];
                        updatedTournaments[currentTournament.tournamentIndex] = {
                          ...updatedTournaments[currentTournament.tournamentIndex],
                          participants: Math.max(0, updatedTournaments[currentTournament.tournamentIndex].participants - 1)
                        };
                        updatedTournaments[currentTournament.tournamentIndex].Progress =
                          (updatedTournaments[currentTournament.tournamentIndex].participants * 100) /
                          updatedTournaments[currentTournament.tournamentIndex].maxParticipants;
                        localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));

                        localStorage.removeItem('currentTournament');
                      } catch (error) {
                        console.error('Error updating tournament on quit:', error);
                      }
                    }
                  }

                  setShowQuitWarning(false)
                  router.back()
                }}
              >
                {t('game.quitTournamentTitle')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TournamentBracket