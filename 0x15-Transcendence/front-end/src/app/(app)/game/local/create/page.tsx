"use client"
import {Check, Dice4, Gamepad2, Monitor } from "lucide-react";
import {electric_blue} from "@/app/Utils";
import BallSettings from "@/app/(app)/game/local/create/BallSettings";
import { Player, useGame} from "@/app/types";
import {MersenneTwister19937, Random} from 'random-js';
import PongPreview, {Direction} from "@/app/(app)/Settings/Game/preview";
import GameModeSettings from "@/app/(app)/Settings/Game/gamemodes-settings";
import TableSettings from "@/app/(app)/Settings/Game/table-settings";
import {FaArrowLeft } from "react-icons/fa";
import {useRouter} from "next/navigation";
import {AnimatePresence, motion as Motion} from 'framer-motion'
import { useTranslation } from "react-i18next";
const engine = MersenneTwister19937.autoSeed()
const random = new Random(engine)



const colors = ["#00b8db", "#a100f2",  "#4361ee", "#F57C00", "#ff0a54"]
const avatars: string[]  = [
    `/images/avatar1-Photoroom.png`,
    `/images/avatar2-Photoroom.png`,
    `/images/avatar3-Photoroom.png`,
    `/images/avatar4-Photoroom.png`
]

const PlayerCard = ({
    title,
    player,
  }: {
    title: string,
    player: Player,
  }) => {
    const { t } = useTranslation();

    return (
        <div className="flex rounded-lg p-8 card-hover-effect flex-col items-center gap-3">
        <div className="flex w-full flex-col items-center gap-2">
          <span className="font-bold truncate max-w-full text-2xl text-cyan-400">{player.name}</span>
          <span className="m-0 text-gray-500">{title}</span>
        </div>
        <AnimatePresence mode="wait">
            <Motion.img
                key={player.avatar}
                initial={{opacity: 0, x: -10}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 10}}
                style={{ borderColor: player.paddleColor }}
                className="rounded-lg size-24 border-3 h-full"
                src={player.avatar}
                alt=""
                width={128}
                height={128}
            />
        </AnimatePresence>
        <div className="flex flex-row gap-5">
          {avatars.map((avatar, idx) => (
            <div
              onClick={() => {
                // setAvatar(avatar)
                player.setAvatar(avatar);
                // setPlayer({...player, avatar: avatar})
              }}
              key={idx}
              className={`rounded-lg cursor-pointer p-0.2 ${player.avatar === avatar ? "bg-[#00F5FF]" : "bg-gray-600"} `}
            >
              <img
                style={{
                  // opacity: selected === idx ? 0.4 : 0.9,
                  // cursor: selected === idx ? "not-allowed" : "pointer",
                }}
                className={`rounded-lg size-24 border-3 h-full ${player.avatar === avatar ? "border-[#00F5FF] drop-shadow-[0_0_10px_rgba(0,245,255,0.7)]" : "border-gray-500"}`}
                src={avatar}
                alt=""
                width={64}
                height={64}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full gap-5">
          <div className="flex w-full flex-col gap-2 transition-all duration-300">
            <span className="text-xs">{t('game.playerName')}</span>
            <div className={`${!player?.name.length ? "border border-red-500" : "border-[#00F5FF]/50"} border flex items-center p-3 bg-[#0F1725] rounded-[5px] overflow-hidden h-full w-full`}>
              <input
                value={player.name}
                onChange={e => {
                    player.setName(e.target.value);
                }}
                className="flex text-sm bg-transparent outline-none w-full"
              />
            </div>
            {!player.name.length && <span className="text-xs text-red-500">Name is required</span>}
          </div>
          <div className="flex w-full flex-col gap-2">
            <span className="text-xs">{t('game.paddleColor')}</span>
            <div className="flex w-full md:flex-nowrap justify-start gap-1 xl:gap-2 h-full rounded-[5px] items-center">
              {colors.map((color, idx) => (
                <div
                  onClick={() => {
                    player.setPaddleColor(color);
                  }}
                  key={idx}
                  className={`flex justify-center items-center cursor-pointer w-full h-6 rounded-full xl:rounded-lg   border-2 transition-all duration-300 ${
                    player.paddleColor === color
                      ? "border-[#23ccdc] shadow-[0_0_8px_#23ccdc]"
                      : "border-transparent hover:border-white/30"
                  }`}
                  style={{
                    backgroundColor: color,
                    opacity: player.paddleColor === color ? 1 : 0.9,
                    position: "relative",
                  }}
                >
                  {player.paddleColor === color && <Check className="absolute" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }


export default function Page() {
    const { t } = useTranslation();
    const router = useRouter()

    const {
        paddleSize,
        ballSpeed,
        ballSize,
        backgroundImage,
        backgroundEnabled,
        player1,
        player2,
        setOpponent
    } = useGame()


    return (
        <div className="flex min-h-screen pt-20 md:ml-20">

            <div className="flex m-5 flex-col w-full items-center border _border justify-between bg-[#081C29]/70 rounded-lg">
                <div className="pt-16 flex flex-row gap-4 items-center pb-8">
                    <Monitor size={48} color={electric_blue}/>
                    <a className="text-3xl font-bold" style={{color: electric_blue}}>{t('game.localMatch')}</a>
                </div>
                <div className="flex top-1/2 bottom-1/2 h-full flex-row justify-between w-full items-center">
                    <div className="flex flex-col w-full items-center  px-8  gap-8">
                        <div className="grid grid-rows-1  xl:gridrow grid-cols-1 md:grid-cols-3 gap-8 w-full items-center">
                            <PlayerCard
                                title={t("game.player1")}
                                player={player1}
                            />
                            <div className="flex items-center flex-col h-full ">
                                <PongPreview
                                    player1={player1}
                                    player2={player2}
                                    direction={Direction.HORIZONTAL}
                                    ballColor={'white'}
                                    bgEnabled={backgroundEnabled}
                                    background={backgroundImage}
                                    paddleSize={paddleSize}
                                    ballSize={ballSize}
                                    ballSpeed={ballSpeed}/>
                            </div>

                            <PlayerCard
                                title={t("game.player2")}
                                player={player2}
                            />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 w-full gap-8 justify-center ">
                            {/*<GameMode/>*/}
                            <GameModeSettings />

                            <BallSettings/>

                            <TableSettings
                                />
                        </div>
                        <div className="flex flex-col justify-center items-center md:flex-row gap-8  w-full">
                            {
                                [
                                    {
                                        label: t("game.back"),
                                        icon: <FaArrowLeft/>,
                                        action: (): void => router.back(),
                                    },
                                    {
                                        label: t("game.play"),
                                        icon: <Gamepad2/>,
                                        action: (): void => {
                                            router.push('/game/local');
                                        },
                                    },
                                ].map((item, index) => {
                                    return (
                                        <button
                                            onClick={() => item.action()}
                                            key={index}
                                            disabled={index === 1 && player2.name.length < 4}
                                            style={{
                                                // cursor: (index === 1 || index === 2 || index === 0) ? 'pointer' : 'not-allowed',
                                                cursor: 'pointer',
                                            }}
                                            className=" p-3 text-cyan-500 card-hover-effect transition-colors duration-200 font-semibold hover:bg-white/5 bg-[#0F1725]  w-full md:max-w-56 disabled:opacity-50  disabled:bg-[#0F1725]/10  cursor-pointer border-[#00F5FF]/50 rounded-lg"
                                        >
                                            <div className="flex flex-row justify-center items-center gap-4">
                                                {item.icon}
                                                {item.label}
                                            </div>
                                        </button>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="h-10" />
            </div>
        </div>
    );
}
