import {Winner, useGame, UserContext, GameMode, Motion, useUser} from "@/app/types";
import { getImageUrl } from "@/app/Utils";
import React, { useEffect, useState, useContext } from "react";

const Header = (
    {
        setWinner,
        winner,
    } : {
        setWinner: (winner: Winner) => void,
        winner: Winner,
    }
) => {
    const {
		player1,
		player2,
        gameTime,
        scoreLimit,
        gameMode,
        opponent,
        vid
    } = useGame()

    const [seconds, setSeconds] = useState(gameTime);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    useEffect(() => {
        setSeconds(gameTime);
    }, [gameTime, winner]);

	const {user} = useUser();

    // === Normalize player roles based on vid ===
    const isPlayer1 = vid === 1;

    const me = isPlayer1 ? user : opponent;
    const enemy = isPlayer1 ? opponent : user;

    const myScore = isPlayer1 ? player1.score : player2.score;
    const enemyScore = isPlayer1 ? player2.score : player1.score;

    const myColor = isPlayer1 ? player1.paddleColor : player2.paddleColor;
    const enemyColor = isPlayer1 ? player2.paddleColor : player1.paddleColor;

    const PlayerCard = ({imgUrl, appearance, username} : {imgUrl? : string, appearance : string, username? : string}) => {
        return (
            <div className="flex w-full items-center gap-6">
                <div className="relative group">
                        <div
                        style={{
                            background: `linear-gradient(to right, ${appearance}, ${appearance})`,
                        }}
                            className="absolute -inset-1 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                        <img
                            className="relative h-20 w-20 aspect-square object-cover rounded-xl  shadow-lg transition-all duration-300 group-hover:border-[#23ccdc]"
                            src={getImageUrl(imgUrl)}
                            alt={username}
                            width={64}
                            height={64}
                            style={{
                                border: `1px solid ${appearance}`
                            }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/default.png';
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-2 ">
                        <div
                            style={{
                                border: `0.5px solid ${appearance}`
                            }}
                            className="flex items-center gap-3 bg-[#081C29]/60 px-4 py-2 rounded-full border ">
                            <div style={{background: appearance}} className="w-3 h-3 rounded-full animate-pulse"/>
                            <h2 className="text-lg truncate max-w-24 font-bold text-white">@{username ?? 'Opponent'}</h2>
                        </div>
                    </div>
                </div>
        );
    }

    return (
        <div
            style={{
                // background: `linear-gradient(to right, ${player2paddleColor}20, ${player1paddleColor}20)`,
            }}
            className="w-[960px] p-6 flex flex-col   bg-[#081C29]/80  rounded-xl "
        >
            {/* Main Header Container */}
            <div
            className="flex items-center flex-wrap md:flex-nowrap  gap-y-4  justify-center md:justify-between">

                <PlayerCard
                    imgUrl={me?.profile_image}
                    appearance={myColor}
                    username={me?.alias || me?.username}
                />
                {/* Center Score Section */}
                <div className=" flex  w-full items-center justify-center max-w-md mx-8">
                    <div className="w-full bg-[#23ccdc]/10  border-[#23ccdc]/40 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center justify-between gap-6 ">
                            {/* Player 1 Score */}
                            <div className="text-center">
                                <div
                                    style={{
                                        border: `1px solid ${myColor}`,
                                        color: myColor,
                                        backgroundColor: `${myColor}10`
                                    }}
                                    className="text-3xl font-bold rounded-lg px-4 py-2 min-w-[60px]">
                                    <Motion.h2
                                        key={myScore}
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: 10}}
                                    >
                                        {myScore}
                                    </Motion.h2>
                                </div>
                            </div>

                            {/* Timer/Score Limit */}
                            <div className="flex flex-col items-center ">
                                <div className="text-center">
                                    <div className="text-4xl font-mono font-bold text-[#23ccdc]  rounded-lg  ">
                                        {gameMode === GameMode.CLASSIC ? `${scoreLimit}` : `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`}
                                    </div>
                                </div>
                                {/* <div className="text-xs text-[#23ccdc]/70 text-center uppercase tracking-wider">
                                    {gameMode === GameMode.CLASSIC ? 'Target Score' : 'Time Remaining'}
                                </div> */}
                            </div>

                            {/* Player 2 Score */}
                            <div className="text-center">
                                <div
                                    style={{
                                        border: `1px solid ${enemyColor}`,
                                        color: enemyColor,
                                    }}
                                    className={`text-3xl font-bold  bg-[${enemyColor}]/10 rounded-lg px-4 py-2 min-w-[60px] border border-[#FF5733]/30`}>
                                    <Motion.h2
                                        key={enemyScore}
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: 10}}
                                    >
                                        {enemyScore}
                                    </Motion.h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player 2 Section */}
                <PlayerCard
                    imgUrl={enemy?.profile_image}
                    appearance={enemyColor}
                    username={enemy?.alias || enemy?.username}
                />
            </div>

            {/* Game Controls */}
        </div>
    );
}


export default Header;