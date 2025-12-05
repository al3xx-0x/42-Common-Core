"use client"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {Coords, Winner, GameMode, GameType, TableResulution, useGame, User, UserContext, useUser, Player} from "@/app/types";
import {WinDialog} from "@/app/(app)/game/dialogs";
import {AnimatePresence, motion} from 'framer-motion'
import { useSocket } from "@/context/SocketContext";
import { getImageUrl } from "@/app/Utils";
import Table from "../table";
import Header from "@/app/(app)/game/Header"


export default function Page() {
    const [winner, setWinner] = useState(Winner.NULL);
    const [ballCoordinates, setBallCoordinates] = useState<Coords>({x: (TableResulution.width / 2) - 20, y: (TableResulution.height / 2) - 20});
    const [playerY, setPlayerY] = useState<number>((TableResulution.height / 2) - 50);
    const [opponentY, setOpponentY] = useState<number>((TableResulution.height / 2) - 50);
    const [lastPress, setLastPress] = useState<string | null>(null);


    const {user} = useUser();

    const {
        opponent,
        setOpponent,
        vid,
        player1,
        player2,
    } = useGame();

    const setPlayerDetails = (player: Player, name?: string, avatar?: string) => {
        player.setName(name ?? 'Opponent');
        player.setAvatar(avatar ?? '/default.jpg');
    };

    // console.log("Opponent:", opponent?.alias);
    // console.log("User:", user.alias);

    useEffect(() => {
        // console.log("Opponent changed:", opponent);
        console.log("User changed:", user);
    }, []);

    useEffect(() => {
        if (vid === 1) {
            player1.setName(user.alias || user.username);
            player2.setName((opponent?.alias || opponent?.username) ?? 'Opponent');

            // Assuming player2's avatar setter should use the opponent's image
            player2.setAvatar(opponent?.profile_image ?? '/default.jpg');
            player1.setAvatar(user?.profile_image ?? '/default.jpg');
        } else {
            // Correcting the name assignment for the 'else' case
            player1.setName((opponent?.alias || opponent?.username) ?? 'Opponent');
            player2.setName(user.alias || user.username);

            // Correcting the avatar assignment (was mixing up player2's setAvatar with opponent username)
            player1.setAvatar(opponent?.profile_image ?? '/default.jpg'); // Assign opponent's avatar to player1
            player2.setAvatar(user?.profile_image ?? '/default.jpg'); // Assign user's avatar to player2
        }
        return () => {
            player1.setName('');
            player2.setName('');
            player1.setAvatar('/default.jpg');
            player2.setAvatar('/default.jpg');
        };
    }, []);

    useEffect(() => {
        if (!opponent) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lastPress === e.key) return;
            setLastPress(e.key);
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                socket?.emit('key_pressed', {id: user.id, key: e.key, pressed: true, vid: vid});
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
                socket?.emit('key_pressed', {id: user.id, key: e.key, pressed: false, vid: vid});
            }
            setLastPress(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            socket?.off('key_pressed');
        };
    }, [lastPress]);

    useEffect(() => {
        socket?.on('gameplay::onGoal', (info: any) => {
            player1.setScore(info.goals);
            player2.setScore(info.opponent_goals);
        });

        socket?.on('gameplay::onEnd', (isWin: boolean) => {
            setWinner(isWin ? Winner.PLAYER1 : Winner.PLAYER2);
        });

        return () => {
            socket?.off('gameplay::onGoal');
            socket?.off('gameplay::onEnd');
            setOpponent(null);
            player1.setScore(0);
            player2.setScore(0);
        }
    }, []);


    const {socket} = useSocket();

    useEffect(() => {
        if (!socket) return;

		socket.on("gameplay::ball", (ball_position: any) => {
			setBallCoordinates({x: ball_position.x, y: ball_position.y});
		});

        socket.on("gameplay::p1", (y: number) => {
			setPlayerY(y);
		});

        socket.on("gameplay::p2", (y: number) => {
			setOpponentY(y);
		});
    }, [socket]);

    const isPlayer1 = vid === 1;


    const myScore = isPlayer1 ? player1.score : player2.score;
    const enemyScore = isPlayer1 ? player2.score : player1.score;

    const myColor = isPlayer1 ? player1.paddleColor : player2.paddleColor;
    const enemyColor = isPlayer1 ? player2.paddleColor : player1.paddleColor;

    return (
        <div className='flex min-h-screen pt-20 md:ml-20 '>
            <AnimatePresence>
                {
                    winner !== Winner.NULL &&
                    <WinDialog
                        player1={ {
                            ...player1,
                            score: myScore,
                            paddleColor: myColor,
                        }}
                        player2={{
                            ...player2,
                            score: enemyScore,
                            paddleColor: enemyColor,
                        }}
                        winner={winner}
                    />
                }
            </AnimatePresence>
            <div className='flex-1 items-center flex flex-col m-5 gap-6'>
                <div className='flex-1 flex flex-col gap-10 items-center justify-center p-4 rounded-xl'>
                 <Header
                    setWinner={setWinner}
                    winner={winner}
                />
                    <Table
                        playerY={playerY}
                        opponentY={opponentY}
                        ballCoordinates={ballCoordinates}
                    />
                </div>
            </div>
        </div>
    );
}
