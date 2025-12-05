import {CirclePower, Play, UserCog} from "lucide-react";
import {useContext, useEffect, useState} from "react";
import {Player, useGame, UserContext, useUser, Winner} from "@/app/types";
import {AnimatePresence, motion} from "framer-motion";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {getImageUrl} from "@/app/Utils";
import { useTranslation } from "react-i18next";


export function PauseDialog(
    {
        setCount,
    } : {
         setCount: (isCount: boolean) => void,
    }
) {
    const [isConfirmDialogShown, setConfirmDialogShown] = useState(false);
    const { t } = useTranslation();

    const {setIsGamePaused} = useGame()

    const router = useRouter();
    const menuItems = [
        {
            label: t('game.resumeGame'),
            icon: <Play/>,
            className: 'border bg-green-500/20 border-[#21364a] hover:border-green-500  text-green-500',
            action: () => {
                // Add resume game logic here
                setIsGamePaused(false)
                setCount(true)
            }
        },
        {
            label: t('game.preferences'),
            icon: <UserCog/>,
            className: 'border bg-[#081C29]/80 border-[#23ccdc]/30 transition-all duration-300 hover:border-[#23ccdc]',
            action: () => {
                // Add settings logic here
                router.push('/game/local/create')
            }
        },
        {
            label: t('game.quitGame'),
            icon: <CirclePower/>,
            className: 'border bg-red-500/20 border-red-500/30 hover:border-red-500  text-red-500',
            action: () => {
                setConfirmDialogShown(true)
                // route.push('/prematch')
                // Add quit game logic here
            }
        }
    ];
    if (isConfirmDialogShown)
        return <QuitConfirmationDialog setConfirmDialogShown={setConfirmDialogShown}/>

    return (
        <motion.div
            initial={{opacity: 0, y: 40}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 40, opacity: 0}}
            className='absolute z-10 w-full  h-full flex-col backdrop-blur-sm flex items-center justify-center'>
            <div className='card-hover-effect p-10  rounded-lg px-20 flex flex-col items-center gap-10'>
                <h2 className='font-bold text-xl'>GAME PAUSED</h2>
                <div className='flex flex-col  gap-4 items-center justify-center'>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className={'transition-all duration-300 flex gap-2 px-10 py-4   p-2 rounded-lg w-full items-center justify-center ' + item.className}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function QuitConfirmationDialog({setConfirmDialogShown} : {setConfirmDialogShown: (isPaused: boolean) => void}) {
    const route = useRouter()

    return (
        <motion.div
            initial={{opacity: 0, y: 40}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 40, opacity: 0}}
            className='absolute z-20 w-full h-full flex-col backdrop-blur-sm flex items-center justify-center'>
            <div className='card-hover-effect pt-10 pb-4 rounded-lg px-20 flex flex-col items-center gap-10'>
                <h2 className='font-bold text-xl'>QUIT GAME</h2>
                <h3 className='m-0 p-0 text-[#A4ACA7]'>Are you sure you want to leave this match?</h3>
                <div className='flex flex-row  gap-x-4  w-full   items-center justify-center'>
                    <button
                        onClick={() => {
                            route.push('/Home')
                        }}
                        className={'border bg-red-500/20 border-red-500/30 hover:border-red-500  text-red-500 transition-all duration-300 flex gap-2 px-10 py-4   p-2 rounded-lg w-full items-center justify-center '}
                    >
                        Yes, Quit
                    </button>
                    <button
                        onClick={() => {
                            setConfirmDialogShown(false)
                        }}
                        className={' border bg-green-500/20 border-green-500/30 hover:border-green-500  text-green-500 transition-all duration-300 flex gap-2 px-10 py-4   p-2 rounded-lg w-full items-center justify-center '}
                    >
                        No, Stay
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export const WinnerBadge = () => {
    return (
        <motion.div
            initial={{scale: 0, rotate: -180}}
            animate={{scale: 1, rotate: 0}}
            transition={{delay: 1.0, type: "spring", damping: 15}}
            className='absolute  bg-white z-50  text-xs -top-4  transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-1 rounded-full text-white font-bold  shadow-lg border-2 border-yellow-300'>
            Winner
        </motion.div>
    );
}
export function WinDialog (
    {
        player1,
        player2,
        winner
    } : { winner: Winner, player1: Player, player2: Player }
) {


    const [counter, setCounter] = useState(3);

    useEffect(() => {
        const timeVal = setInterval(() => {
            if (counter === 0) return;
            setCounter(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timeVal);
    }, []);

    const router = useRouter();

    // console,log('Counter value:', counter);
    useEffect(() => {
        if (counter === 0) {
            router.back();
        }
    }, [counter]);

    console.log('Winner Dialog Rendered with:', {player1, player2, winner});
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.8, opacity: 0}}
            transition={{type: "spring", damping: 20, stiffness: 300}}
            className='inset-0  absolute z-20 w-full backdrop-blur-sm  flex-col flex items-center justify-center'>

            {/* Main Dialog Container */}
            <div className=' justify-center card-hover-effect relative rounded-3xl  p-8 flex flex-col items-center gap-8 max-w-4xl mx-4'>
                {/* Decorative Background Elements */}
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#00FF88]/10 rounded-full blur-3xl"/>
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-[#23ccdc]/10 rounded-full blur-3xl"/>

                {/* Title */}
                <motion.div
                    initial={{y: -20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.2}}
                    className='text-center'>
                    {
                        (winner === Winner.NO_ONE) &&
                        <h2 className='font-bold text-4xl xl:text-6xl  bg-clip-text text-[#FF5555]  mb-2'>
                            No Winner
                        </h2>
                    }
                    {
                        (winner === Winner.PLAYER2) &&
                        <h2 className='font-bold text-4xl xl:text-6xl  bg-clip-text text-[#FF5555]  mb-2'>
                         Game over
                        </h2>
                    }
                    {
                        (winner === Winner.PLAYER1) &&
                        <h2 className='font-bold text-4xl xl:text-6xl  bg-clip-text text-[#00FF88]  mb-2'>
                            Victory !
                        </h2>
                    }
                </motion.div>

                {/* Players and Scores Container */}
                <motion.div
                    initial={{y: 20, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{delay: 0.4}}
                    style={{
                        // direction: vid === 1 ? 'ltr'  : 'rtl'
                    }}
                    className='flex flex-col md:flex-row gap-12 w-full items-center justify-center'>

                    {/* Player 1 (left) */}
                    <div className='relative flex flex-col items-center gap-4'>
                        {player1.score > player2.score && <WinnerBadge/>}


                        <motion.div
                            // whileHover={{scale: 1.05}}
                            className='relative group'>
                            <div
                                className="absolute -inset-2 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                style={{background: `linear-gradient(45deg, ${player1.score}, ${player1.score}88)`}}
                            ></div>
                            <div className="relative w-24 h-24">
                                <Image
                                    src={getImageUrl(player1.avatar)}
                                    alt={player1.name ?? 'Opponent'}
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl"
                                    style={{ border: `3px solid ${player1.paddleColor}` }}
                                    onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default.png';
                                    }}
                                />
                            </div>

                        </motion.div>
                        <h3 className='text-xl truncate  max-w-24  font-bold text-white mb-1'>{player1?.name ?? 'Opponent'}</h3>
                    </div>

                    {/* Score Section */}
                    <div className='flex flex-col items-center  gap-6'>
                        <div
                             className='flex  items-center  gap-6'>
                            {/* Player 1 Score */}
                            <motion.div
                                initial={{opacity: 0, x: 10}}
                                animate={{opacity: 1, x:0}}
                                transition={{delay: 0.6, type: "spring"}}
                                style={{
                                    backgroundColor: `${player1.paddleColor}15`,
                                    borderColor: player1.paddleColor,
                                    color: player1.paddleColor,
                                }}
                                className='text-4xl font-bold border-2 rounded-2xl px-6 py-4 min-w-[80px] text-center shadow-lg'>
                                {player1.score}
                            </motion.div>

                            {/* VS Separator */}
                            <div className='flex flex-col items-center gap-2'>
                                <div className="text-2xl font-bold text-gray-400">VS</div>
                            </div>

                            {/* Player 2 Score */}
                            <motion.div
                                initial={{opacity: 0, x: -10}}
                                animate={{opacity: 1, x:0}}
                                transition={{delay: 0.6, type: "spring"}}
                                style={{
                                    backgroundColor: `${player2.paddleColor}15`,
                                    borderColor: player2.paddleColor,
                                    color: player2.paddleColor,
                                }}
                                className='text-4xl font-bold border-2 rounded-2xl px-6 py-4 min-w-[80px] text-center shadow-lg'>
                                {player2.score}
                            </motion.div>
                        </div>
                    </div>

                    {/* Player 2 (right) */}
                    <div className='relative w-full flex flex-col items-center gap-4'>
                    {player2.score > player1.score && <WinnerBadge/>}
                        <motion.div className='relative group'>
                            <div
                                className="absolute -inset-2 rounded-2xl  blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                                style={{background: `linear-gradient(45deg, ${player2.paddleColor}, ${player2.paddleColor}88)`}}
                            ></div>
                            <div className="relative w-24 h-24">
                                <Image
                                    src={getImageUrl(player2?.avatar)}
                                    alt={player2?.name ?? 'Opponent'}
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl"
                                    style={{ border: `3px solid ${player2.paddleColor}` }}
                                    onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/default.png';
                                    }}
                                />
                                </div>

                        </motion.div>
                        <h3 className='text-xl truncate max-w-24 text-center font-bold text-white mb-1'>
                            {player2?.name ?? 'Opponent'}
                        </h3>
                    </div>
                    </motion.div>
                <div
                className="text-cyan-500 text-2xl bg-cyan-500/20 font-bold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={counter}
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 10}}
                            onClick={() => {}}
                            className='inline-block'>
                            {counter}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}