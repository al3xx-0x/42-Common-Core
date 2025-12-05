// src/app/layout.tsx
"use client"
import "../app/globals.css"
import {Open_Sans, Orbitron} from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import {useEffect, useState, useMemo} from "react";
import {GameMode, GameContext, User, UserContext, GameType, Player, UserProvider} from "@/app/types";
import {fetchWithToken} from "@/app/Utils";
import {baseUrl} from "@/app/types";
import {usePathname, useRouter} from "next/navigation";
import {toast} from "sonner";
import { SocketProvider } from "@/context/SocketContext";
import { Plug } from "lucide-react";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [isOnline, setOnline] = useState(false);

    // Player 1 state
    const [player1Name, setPlayer1Name] = useState("");
    const [player1PaddleColor, setPlayer1PaddleColor] = useState('#00b8db');
    const [player1Avatar, setPlayer1Avatar] = useState('/images/avatar1-Photoroom.png');
    const [player1Score, setPlayer1Score] = useState(0);

    // Player 2 state
    const [player2Name, setPlayer2Name] = useState("Opponent");
    const [player2PaddleColor, setPlayer2PaddleColor] = useState('#ff0a54');
    const [player2Avatar, setPlayer2Avatar] = useState('/images/avatar1-Photoroom.png');
    const [player2Score, setPlayer2Score] = useState(0);


    // Game state
    const [backgroundEnabled, setBackgroundEnabled] = useState(false);
    const [ballSpeed, setBallSpeed] = useState(10);
    const [ballSize, setBallSize] = useState(20);
    const [paddleSize, setPaddleSize] = useState(100);
    const [vid, setVid] = useState(0);
    const [gameMode, setGameMode] = useState(GameMode.CLASSIC);
    const [gameTime, setGameTime] = useState(60); // in seconds
    const [scoreLimit, setScoreLimit] = useState(3);
    const [isGamePaused, setIsGamePaused] = useState(true);
    const [backgroundImage, setBackgroundImage] = useState("https://4kwallpapers.com/images/walls/thumbs_3t/8324.png");

    // Create Player instances with setters
    const player1: Player = useMemo(() => ({
        name: player1Name,
        paddleColor: player1PaddleColor,
        avatar: player1Avatar,
        score: player1Score,
        setName: setPlayer1Name,
        setPaddleColor: setPlayer1PaddleColor,
        setAvatar: setPlayer1Avatar,
        setScore: setPlayer1Score,
    }), [player1Name, player1PaddleColor, player1Avatar, player1Score]);

    const player2: Player = useMemo(() => ({
        name: player2Name,
        paddleColor: player2PaddleColor,
        avatar: player2Avatar,
        score: player2Score,
        setName: setPlayer2Name,
        setPaddleColor: setPlayer2PaddleColor,
        setAvatar: setPlayer2Avatar,
        setScore: setPlayer2Score,
    }), [player2Name, player2PaddleColor, player2Avatar, player2Score]);



    const [opponent, setOpponent] = useState<User | null>(null);

    const game: GameType = {
        opponent,
        setOpponent,
        isGamePaused,
        ballSpeed,
        setBallSpeed,
        paddleSize,
        ballSize,
        vid,
        setVid,
        scoreLimit,
        gameMode,
        isOnline,
        setOnline: (isOnline: Boolean) => setOnline(isOnline as boolean),
        backgroundImage,
        setBackgroundImage,
        setIsGamePaused,
        setBallSize,
        setPaddleSize,
        setScoreLimit,
        setGameMode,
        gameTime,
        setGameTime,
        isTournament: false,
        backgroundEnabled,
        setBackgroundEnabled,
        player1,
        player2,
    };

    // Update Player type to include setters
    const pathname = usePathname();
    const router = useRouter();

    // useEffect(() => {
    //     // ... existing useEffect logic ...
    //     const fetchProfile = async () => {
    //         try {
    //             const res = await fetchWithToken(`${baseUrl}/api/settings/profile`, { method: 'GET' });
    //             if (!res.ok) throw new Error('Unauthorized');
    //             const {user} = await res.json();

    //             setUser(user);

    //             setPlayer1Name(user.username); // Update player1 name directly

    //             // Update i18n language when user is loaded
    //             if (user.language && i18n.language !== user.language) {
    //                 i18n.changeLanguage(user.language);
    //             }
    //         } catch (e) {
    //             console.error("Error fetching profile:", e);
    //             router.replace('/auth?mode=sign-in');
    //         }
    //     };

    //     if (!["/", "/auth/reset-password", '/auth/2fa/verify', '/auth/email/verify', '/auth/forgot-password', '/auth/email-sent'].includes(pathname)) {
    //         if (!localStorage.getItem('accessToken')) {
    //             toast.error("You need to sign in first!");
    //             router.replace('/auth?mode=sign-in');
    //             return;
    //         }
    //         fetchProfile();
    //     }
    // }, [pathname]);

    return (
        <html lang={i18n?.language || "en"} className={openSans.className}>
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/logo.png" type="image/png" />
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <title>Transcendence</title>
            </head>
            <body className="relative min-h-screen text-white scrollbar-hide">
                <GameContext.Provider value={game}>
                    <UserProvider>
                        <SocketProvider>
                            <I18nextProvider i18n={i18n}>
                                {children}
                            </I18nextProvider>
                        </SocketProvider>
                    </UserProvider>
                </GameContext.Provider>
                <Toaster />
            </body>
        </html>
    );
}