"use client";
import React, {useEffect, useState, useRef, useContext} from "react";
import gameDefaults, {Coords, GameMode, Motion, Player, useGame, UserContext, Winner} from "@/app/types";
import {WinDialog} from "../dialogs";

const PlayerCard = ({player} : {player: Player}) => {

  return (
      <div className="flex w-full items-center gap-6">
          <div className="relative group">
              <div
                style={{
                    background: `linear-gradient(to right, ${player.paddleColor}, ${player.paddleColor})`,
                }}
                className="absolute -inset-1 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <img
                  className="relative h-20 w-20 aspect-square object-cover rounded-xl  shadow-lg transition-all duration-300 group-hover:border-[#23ccdc]"
                  src={player.avatar}
                  alt={player.name}
                  width={64}
                  height={64}
                  style={{
                      border: `1px solid ${player.paddleColor}`
                  }}
                  onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default.png';
                  }}
              />
              </div>
              <div className="flex flex-col gap-2 ">
                  <div
                      style={{
                          border: `0.5px solid ${player.paddleColor}`
                      }}
                      className="flex items-center gap-3 bg-[#081C29]/60 px-4 py-2 rounded-full border ">
                      <div style={{background: player.paddleColor}} className="w-3 h-3 rounded-full animate-pulse"/>
                      <h2 className="text-lg truncate max-w-24 font-bold text-white">@{player.name ?? 'Opponent'}</h2>
                  </div>
              </div>
          </div>
  );
}

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
        gameTime,
        scoreLimit,
        gameMode,
        isGamePaused,
        player1,
        player2,
        setIsGamePaused,
    } = useGame();

    const [seconds, setSeconds] = useState(gameTime );
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    console.log('Winner in Header:', winner, " Scores:", player1.score, " | ", player2.score);
    useEffect(() => {
      if (isGamePaused) return ;

      if (gameMode === GameMode.CLASSIC) return;

      const interval = setInterval(() => {
        timerSetter();
      }, 1000);


      return () => clearInterval(interval);
    }, [isGamePaused]);


    useEffect(() => {
      if (seconds > 0) return;

      console.log('Setting winner to NO_ONE due to tie', player1.score, player2.score);
      if (player1.score === player2.score) {
        setWinner(Winner.NO_ONE);
      } else if (player1.score > player2.score) {
        setWinner(Winner.PLAYER1);
      } else if (player1.score < player2.score) {
        setWinner(Winner.PLAYER2);
      } else {
        setWinner(Winner.NO_ONE);
      }
    }, [player1.score, player2.score, seconds]);

    const timerSetter = () => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          setIsGamePaused(true);
        }
        return prevSeconds - 1;
      });
    }

    useEffect(() => {
      if (gameMode === GameMode.TIMED) return;
      console.log('Checking scores for winner:', player1.score, player2.score);
      if (player1.score >= scoreLimit || player2.score >= scoreLimit) {
        setIsGamePaused(true);
      }

      if (player1.score >= scoreLimit)
        setWinner(Winner.PLAYER1);
      if (player2.score >= scoreLimit)
        setWinner(Winner.PLAYER2);
      if (player1.score === scoreLimit && player2.score === scoreLimit) {
        setWinner(Winner.NO_ONE);
        return;
      }
    }, [player1.score, player2.score]);

    return (
        <div
            className="w-[960px] p-6  flex flex-col bg-[#081C29]/80 rounded-xl "
        >
            {/* Main Header Container */}
            <div
            className="flex items-center flex-wrap md:flex-nowrap  gap-y-4  justify-center md:justify-between">

                <PlayerCard player={player1}/>
                {/* Center Score Section */}
                <div className=" flex  w-full items-center justify-center max-w-md mx-8">
                    <div className="w-full bg-[#23ccdc]/10  border-[#23ccdc]/40 rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center justify-between gap-6 ">
                            {/* Player 1 Score */}
                            <div className="text-center">
                                <div
                                    style={{
                                        border: `1px solid ${player1.paddleColor}`,
                                        color: player1.paddleColor,
                                        backgroundColor: `${player1.paddleColor}10`
                                    }}
                                    className="text-3xl font-bold rounded-lg px-4 py-2 min-w-[60px]">
                                    <Motion.h2
                                        key={player1.score}
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: 10}}
                                    >
                                        {player1.score}
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
                                        border: `1px solid ${player2.paddleColor}`,
                                        color: player2.paddleColor,
                                    }}
                                    className={`text-3xl font-bold  bg-[${player2.paddleColor}]/10 rounded-lg px-4 py-2 min-w-[60px] border border-[#FF5733]/30`}>
                                    <Motion.h2
                                        key={player2.score}
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: 10}}
                                    >
                                        {player2.score}
                                    </Motion.h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Player 2 Section */}
                <PlayerCard
                  player={player2}
                />
            </div>
            {/* Game Controls */}
        </div>
    );
}

const Table = (
  {
    playerPaddleColor1,
    playerPaddleColor2,
    playerY,
    opponentY,
    ballCoordinates,
  } : {
    playerPaddleColor1: string,
    playerPaddleColor2: string,
    playerY: number,
    opponentY: number,
    ballCoordinates: Coords,
  }) => {

  const {backgroundEnabled, backgroundImage, ballSize, paddleSize,} = useGame();
	return (
		<div
    className="relative bg-dark w-[960px] h-[640px] ">
      <div
      className="absolute inset-0 opacity-20 object-cover"
    style={{backgroundImage: backgroundEnabled ? `url(${backgroundImage})` : ""}}

      />
			{/* Player 1 */}
			<div
      className="absolute left-0 h-[100px] w-[20px] bg-cyan-500 rounded-full"
				style={{
					transform: `translateY(${playerY}px)`,
          backgroundColor: playerPaddleColor1,
          height: paddleSize
					// transition: 'transform 0.2s ease-out'
				}}
			/>

			{/* Player 2 */}
			<div className="absolute right-0 h-[100px] w-[20px] bg-cyan-500 rounded-full"
				style={{
					transform: `translateY(${opponentY}px)`,
					transition: 'transform 0.1s ease-out',
          backgroundColor: playerPaddleColor2,
          height: paddleSize

				}}
			/>

			{/* Ball */}
			<div
				className={`absolute w-[40px] h-[40px] z-10 bg-cyan-500 rounded-full`}
				style={{
					width: ballSize * 2,
					height: ballSize * 2,
					transform: `translate(${ballCoordinates.x - (ballSize* 2) / 2}px, ${ballCoordinates.y - (ballSize* 2) / 2}px)`,
					// transition: 'transform 0.1s ease-out'
				}}
			/>

			{/* Middle line and circle */}
			<div className="absolute opacity-70 h-full left-1/2 -translate-x-1/2 transform border-r-2 border-dashed border-cyan-500" />
			<div className="absolute opacity-70 h-24 w-24 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform border-cyan-500 rounded-full border-2 border-dashed"/>

			{/* Corners */}
			<div className="absolute -translate-x-2 translate-y-2 bottom-0 h-2 z-10 w-24 bg-cyan-700 rounded-r-full"/>
			<div className="absolute -translate-x-2 translate-y-2 bottom-0 h-24 z-10 w-2 bg-cyan-700 rounded-t-full"/>

			<div className="absolute -translate-x-2 -translate-y-2 top-0 h-2 z-10 w-24 bg-cyan-700 rounded-r-full"/>
			<div className="absolute -translate-x-2 -translate-y-2 top-0 h-24 z-10 w-2 bg-cyan-700 rounded-b-full"/>


			<div className="absolute -translate-y-2 translate-x-1 right-0 h-2 z-10 w-24 bg-cyan-700 rounded-l-full"/>
			<div className="absolute -translate-y-2 translate-x-1 right-0 h-24 z-10 w-2 bg-cyan-700 rounded-b-full"/>

			<div className="absolute translate-x-1 translate-y-1 right-0 bottom-0 h-2 z-10 w-24 bg-cyan-700 rounded-l-full"/>
			<div className="absolute translate-x-1 translate-y-1 right-0 bottom-0 h-24 z-10 w-2 bg-cyan-700 rounded-t-full"/>
		</div>
	);
}

const TABLE_WIDTH = 960;
const TABLE_HEIGHT = 640;
// const BALL_RADIUS = 20;

export default function Page() {
  const {player1, player2, setPaddleSize, setBallSize, setBallSpeed, scoreLimit, backgroundEnabled, setIsGamePaused, backgroundImage, isGamePaused, ballSpeed, paddleSize, ballSize} = useGame();

  const [playerY, setPlayerY] = useState(TABLE_HEIGHT / 2 - (paddleSize / 2));
  const [opponentY, setOpponentY] = useState(TABLE_HEIGHT / 2 - (paddleSize / 2));

  const paddleSpeed = ballSpeed * 1.5;
  const [counter, setCounter] = useState(3);
  const [background, setBackground] = useState<string | null>(null);

  useEffect(() => {
    if (backgroundEnabled) {
      setBackground(backgroundImage);
    }
  }, [backgroundEnabled]);


  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          setIsGamePaused(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const [ball, setBall] = useState({
    x: TABLE_WIDTH / 2,
    y: TABLE_HEIGHT / 2,
    velocityX: ballSpeed,
    velocityY: 0,
  });
  const [winner, setWinner] = useState<Winner>(Winner.NULL);

  const keysRef = useRef({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  const playerYRef = useRef(playerY);
  const opponentYRef = useRef(opponentY);
  const ballRef = useRef(ball);
  const animationRef = useRef<number>(0);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keysRef.current.hasOwnProperty(e.key)) {
        e.preventDefault();
        keysRef.current[e.key as keyof typeof keysRef.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keysRef.current.hasOwnProperty(e.key)) {
        keysRef.current[e.key as keyof typeof keysRef.current] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    function gameLoop() {
      if (winner !== Winner.NULL || isGamePaused) return;

      // Move paddles
      if (keysRef.current.w && playerYRef.current > 0) playerYRef.current -= paddleSpeed;
      if (keysRef.current.s && playerYRef.current + paddleSize < TABLE_HEIGHT) playerYRef.current += paddleSpeed;
      if (keysRef.current.ArrowUp && opponentYRef.current > 0) opponentYRef.current -= paddleSpeed;
      if (keysRef.current.ArrowDown && opponentYRef.current + paddleSize < TABLE_HEIGHT) opponentYRef.current += paddleSpeed;

      // Move ball
      let { x, y, velocityX, velocityY } = ballRef.current;
      x += velocityX;
      y += velocityY;

      // LEFT paddle collision
      if (x - ballSize <= 20 && y + ballSize >= playerYRef.current && y - ballSize <= playerYRef.current + paddleSize) {
        velocityX = Math.abs(velocityX);
        velocityY = (y - (playerYRef.current + paddleSize / 2)) * 0.1;
        x = 20 + ballSize;
      }

      // RIGHT paddle collision
      if (x + ballSize >= TABLE_WIDTH - 20 && y + ballSize >= opponentYRef.current && y - ballSize <= opponentYRef.current + paddleSize) {
        velocityX = -Math.abs(velocityX);
        velocityY = (y - (opponentYRef.current + paddleSize / 2)) * 0.1;
        x = TABLE_WIDTH - 20 - ballSize;
      }

      // Top & bottom collision
      if (y - ballSize <= 0 || y + ballSize >= TABLE_HEIGHT) velocityY *= -1;

      // Goal detection
      if (x - ballSize < 0) {
        player2.setScore(s => {
          const newScore = s + 1;
          // if (newScore >= scoreLimit) setWinner(Winner.PLAYER2);
          return newScore;
        });
        x = TABLE_WIDTH / 2;
        y = playerYRef.current + paddleSize / 2;
        velocityX = ballSpeed;
        velocityY = 0;
      }

      if (x + ballSize > TABLE_WIDTH) {
        player1.setScore(s => {
          const newScore = s + 1;
          // if (newScore >= scoreLimit) setWinner(Winner.PLAYER1);
          return newScore;
        });
        x = TABLE_WIDTH / 2;
        y = opponentYRef.current + paddleSize / 2;
        velocityX = - ballSpeed;
        velocityY = 0;
      }

      ballRef.current = { x, y, velocityX, velocityY };
      setBall({ ...ballRef.current });
      setPlayerY(playerYRef.current);
      setOpponentY(opponentYRef.current);

      animationRef.current = requestAnimationFrame(gameLoop);
    }

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [winner, isGamePaused]);

  // Reset the score when match complete
  useEffect(() => {
    return () => resetGame();
  }, []);

  const resetGame = () => {
    player1.setScore(0);
    player2.setScore(0);
    setBallSize(gameDefaults.ballSize);
    setBallSpeed(gameDefaults.ballSpeed);
    setPaddleSize(gameDefaults.paddleSize);
    setWinner(Winner.NULL);
    playerYRef.current = TABLE_HEIGHT / 2 - paddleSize / 2;
    opponentYRef.current = TABLE_HEIGHT / 2 - paddleSize / 2;
    ballRef.current = { x: TABLE_WIDTH / 2, y: TABLE_HEIGHT / 2, velocityX: ballSpeed, velocityY: 0 };
    setPlayerY(playerYRef.current);
    setOpponentY(opponentYRef.current);
    setBall(ballRef.current);
    animationRef.current = requestAnimationFrame(() => {});
    setIsGamePaused(true);
    setCounter(3);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">

      <div className="flex flex-col gap-6">
        <Header
          setWinner={setWinner}
          winner={winner}
        />
        <div className="relative">
          <Table
            playerPaddleColor1={player1.paddleColor}
            playerPaddleColor2={player2.paddleColor}
            playerY={playerY}
            opponentY={opponentY}
            ballCoordinates={{ x: ball.x, y: ball.y }}
          />
          {
            isGamePaused &&
            <h1 className="absolute inset-0 text-3xl bg-dark backdrop-blur-sm z-10 flex items-center justify-center">{counter}</h1>
          }
        </div>

      </div>

        {winner !== Winner.NULL &&
            (
                <WinDialog
                    player1={player1}
                    player2={player2}
                    winner={winner}
                />
            )
        }
    </div>
  );
}
