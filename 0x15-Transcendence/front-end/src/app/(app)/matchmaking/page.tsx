'use client'
import {electric_blue, fetchWithToken, getImageUrl, getPlayerProfile} from "@/app/Utils";
import {Ban, CircleX, Globe, Swords, UserPlus, UsersRound} from "lucide-react";
import Image from "next/image";
import {Match, useGame, User, UserContext, useUser} from "@/app/types";
import {BiRadar} from "react-icons/bi";
import RadarScanner from "@/app/(app)/components/RadarScanner";
import { io, Socket } from "socket.io-client";
import React, { useContext, useEffect, useRef, useState} from "react";
import { useSocket } from "../../../context/SocketContext";
import { AnimatePresence, motion as Motion } from "framer-motion";
import {useRouter} from "next/navigation";
import { baseUrl } from "@/app/types";
import { useTranslation } from "react-i18next";




export default function Matchmaking() {
    const { t } = useTranslation();
    const [matchStatus, setMatchStatus] = useState("Searching...");


    const {user} = useUser();

    const router = useRouter();
    const hasEmitted = useRef(false);
    const {opponent, setOpponent, setVid} = useGame();
    const {isConnected, socket} = useSocket();

    useEffect(() => {
        if (!socket || !user?.id || !isConnected || hasEmitted.current) return;

        hasEmitted.current = true;
        socket.emit("matchmake", { id: user.id });

        const handleMatchmake = async (info : any) => {

          if (info.type === 'opponent_left') {
            setOpponent(null);
            hasEmitted.current = false; // allow re-entry
            socket.emit("matchmake", { id: user.id });
            setVid(0);
            setMatchStatus(t('game.searching')) ;
          }

          if (info.type === 'match_found') {
            if (info.opponent == user.id) {
                socket.emit("im_left", {id: user.id});
                return;
            }
            const player = await getPlayerProfile(info.opponent);
            setVid(info.vid);
            setMatchStatus("Match Preparing...");
            setOpponent(player);
          }
        };

        const handleMatchStart = (info : any) => {
            // if (!opponent) return;
          router.replace('/game/online');
          socket.emit('ready');
          //   setCounter(info.time);
        };


        socket.on("matchmake", handleMatchmake);

        socket.on('match_start', handleMatchStart);
        return () => {
          socket.off("matchmake", handleMatchmake);
          socket.off("match_start", handleMatchStart);
          hasEmitted.current = false;
        };
      }, [socket, user?.id, isConnected]);

    useEffect(() => {
        if (socket && isConnected && user?.id) {
          hasEmitted.current = false;
        }
      }, [user?.id]);


    interface PlayerParams {
        username: string;
        full_name: string;
        profile_image: string;
    }

    interface PlayerParams {
        username: string;
        full_name: string;
        profile_image: string;
        level?: number;
        wins?: number;
        losses?: number;
        rank?: string;
    }

    const PlayerCard = ({player} : {player: User | null}) => {

        if (!player)
            return (
                <div className="flex card-hover-effect w-full p-5 rounded-lg flex-col items-center gap-y-4">
                    {/* Player Image Section - Skeleton */}
                    <div className='relative flex flex-col gap-2 items-center'>
                        <div className="relative">
                            <div className="rounded-lg w-64 h-72 bg-white/10 border-2 border-[#00F5FF]/40 animate-pulse" />
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <div className="bg-white/20 p-2 rounded-full w-full h-6 animate-pulse" />

                        <div className="bg-white/10 rounded-full h-4 w-3/4 mx-auto animate-pulse" />

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center gap-1">
                                <div className="bg-green-400/30 h-7 w-10 rounded animate-pulse" />
                                <span className="text-gray-400 text-xs">{t('game.wins')}</span>
                            </div>

                            <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center gap-1">
                                <div className="bg-red-400/30 h-7 w-10 rounded animate-pulse" />
                                <span className="text-gray-400 text-xs">{t('game.losses')}</span>
                            </div>

                            <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center gap-1">
                                <div className="bg-[#00F5FF]/30 h-7 w-12 rounded animate-pulse" />
                                <span className="text-gray-400 text-xs">{t('game.winRate')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        return (
            <div className="flex card-hover-effect w-full p-5 rounded-lg flex-col items-center gap-y-4">
                {/* Player Image Section */}
                <div className='relative flex flex-col gap-2 items-center'>
                    <div className="relative">
                        <Image
                            className="rounded-lg w-64 h-72 object-cover border-2 border-[#00F5FF]/30"
                            src={getImageUrl(player.profile_image)}
                            alt={player.username}
                            width={1024}
                            height={1024}
                        />
                    </div>
                </div>

                {/* Player Info Section */}
                <div className="w-full flex flex-col gap-2">
                    {/* Username */}
                    <span className=" truncate max-w-full p-2 rounded-lg w-full text-center  text-xl font-semibold">
                    @{player.username}
                </span>

                    {/* Full Name */}
                    <span className="text-gray-400 text-sm text-center truncate">{player.first_name} {player.last_name}</span>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {/* Wins */}
                        <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-green-400 font-bold text-lg">{player.win_count}</span>
                            <span className="text-gray-400 text-xs">{t('game.wins')}</span>
                        </div>

                        {/* Losses */}
                        <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-red-400 font-bold text-lg">{player.lose_count}</span>
                            <span className="text-gray-400 text-xs">{t('game.losses')}</span>
                        </div>

                        {/* Win Rate */}
                        <div className="bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-[#00F5FF] font-bold text-lg">{player.win_rate}%</span>
                            <span className="text-gray-400 text-xs">{t('game.winRate')}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
            <div className="min-h-screen flex  bg-no-repeat bg-cover bg-center pt-20 md:ml-20 flex-col gap-10" >
            <div className="flex-1  m-5  flex-col items-center h-full  card-hover-effect  flex justify-between bg-[#081C29]/80 rounded-2xl">
                <div className="pt-16 flex flex-col gap-4 items-center pb-8 justify-center">
                    <div className='flex gap-4'>
                        <Swords size={48} color={electric_blue}/>
                        <a className="text-3xl font-bold" style={{color: electric_blue}}>{t('game.headToHead').toUpperCase()}</a>
                    </div>
                    <h4 className=' text-center text-[#A7A0A0]'>{t('game.headToHeadSubtitle')}</h4>
                </div>
                <div className="flex flex-row px-20 w-full items-center">
                    <div className='w-full h-full  px-10 gap-y-20 flex items-center flex-col justify-center '>
                        <div className="grid grid-cols-1  xl:grid-cols-3  justify-evenly gap-8  items-center  h-full w-full">

                           <PlayerCard player={user}/>

                            {
                                opponent &&
                                <div className=' p-5 py-6 justify-center gap-y-10 flex flex-col font-bold rounded-lg items-center h-full w-full'>
                                    <div
                                        className='relative flex flex-col gap-4'>
                                        <div className="flex items-center justify-center
                                                text-6xl md:text-8xl font-extrabold text-[#00F5FF]
                                                bg-[#081C29]/80 border border-[#00F5FF]/30
                                                rounded-full w-40 h-40 shadow-[0_0_25px_#00F5FF] animate-pulse">
                                            VS
                                        </div>
                                    </div>
                                </div>

                            }
                            {
                                !opponent &&
                                <div className='relative p-16   justify-center flex flex-col font-bold rounded-lg items-center h-full w-full'>
                                    <RadarScanner />
                                </div>
                            }
                            {
                                <PlayerCard
                                    player={opponent}
                                />
                            }
                        </div>

                        <AnimatePresence mode="wait">
                            <Motion.span
                                key={matchStatus}
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0, scale: 1}}
                                exit={{opacity: 0, y: -10}}
                                className="font-bold text-2xl text-cyan-500">{matchStatus}</Motion.span>
                        </AnimatePresence>
                        <Motion.button
                            onClick={() => {
                                router.back();
                            }}
                            className="cursor-pointer mb-10 px-10 py-2 text-2xl card-hover-effect hover:border-red-400 hover:text-red-400 text-cyan-500 transition-all duration-300 items-center flex justify-center gap-x-4  rounded-lg p-1">
                            <CircleX size={32}/>
                            {t('game.cancel')}
                        </Motion.button>
                    </div>
                </div>
                <div className="" />
            </div>
        </div>
    );
}