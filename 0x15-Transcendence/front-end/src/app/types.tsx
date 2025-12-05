import { error } from "console";
import React, {createContext, useContext, useEffect, useState} from "react";
import { Dispatch, SetStateAction } from "react";
import { fetchWithToken } from "./Utils";
import { usePathname, useRouter } from "next/navigation";
export {motion as Motion} from "framer-motion";
import i18n from "./i18n";
import { User } from "lucide-react";


export const baseUrl = 'https://e3r1p1.1337.ma'

export default {
    ballSpeed: 10,
    ballSize: 20,
    paddleSize: 100
};

export type Match = {
    player1: string
    player2: string
    player1Avatar: string
    player2Avatar: string
}

export enum Winner {
    PLAYER1,
    PLAYER2,
    NO_ONE,
    NULL
}

export interface Tournament {
    id: number;
    name: string;
    time: string;
    created_by: number;
    status: string;
    prize_value: number;
    players_count: number;
}

export enum Side {
    UNSET,
    LEFT,
    RIGHT
}

export class Player {
    name: string;
    avatar?: string = '/default.png';
    paddleColor: string;
    score: number;
    setName: (name: string) => void;
    setPaddleColor: React.Dispatch<SetStateAction<string>>;
    setAvatar: React.Dispatch<SetStateAction<string>>;
    setScore: React.Dispatch<SetStateAction<number>>

    constructor({
        name,
        avatar,
        paddleColor,
        score,
        setName,
        setPaddleColor,
        setAvatar,
        setScore,
    }: {
        name: string;
        avatar: string;
        paddleColor: string;
        score: number;
        setName: (name: string) => void;
        setPaddleColor: React.Dispatch<SetStateAction<string>>;
        setAvatar: React.Dispatch<SetStateAction<string>>;
        setScore: React.Dispatch<SetStateAction<number>>;
    }) {
        this.name = name;
        this.avatar = avatar;
        this.paddleColor = paddleColor;
        this.score = score;
        this.setName = setName;
        this.setPaddleColor = setPaddleColor;
        this.setAvatar = setAvatar;
        this.setScore = setScore;
    }
}

export type TablePreviewProps = {
    leftPadelColor: string
    rightPadelColor: string
    ballSize: number
    paddleSize: number
    images: Array<string>
}

export type BackgroundImageContextType = {
    backgroundEnabled: boolean
    ballSpeed: number
    paddleSize: number
    setBackground: (enabled: boolean) => void
    index: number
    ballSize: number
    setBackgroundImage: (index: number) => void
}

export const BackgroundImageContext: React.Context<BackgroundImageContextType> = createContext<BackgroundImageContextType>({
    setBackground: () => {},
    index: 0,
    ballSpeed: 30,
    ballSize: 10,
    paddleSize: 0,
    backgroundEnabled: false,
    setBackgroundImage: () => {},
})

export type PlayerContextType = {
    avatarUsed: number,
    colorIndex: number,
    playerName: string,
    setPlayerName: (name: string) => void,
    setColorIndex: (enabled: number) => void,
    setAvatar: (index: number) => void
}

export const PlayerContext: React.Context<PlayerContextType> = createContext<PlayerContextType>({
    avatarUsed: 0,
    colorIndex: 1,
    playerName: '',
    setPlayerName: (name: string) => {},
    setColorIndex: () => {},
    setAvatar: () => {},
})

export const TableResulution = {
    width: 960,
    height: 640
}

export enum GameMode {
    CLASSIC,
    TIMED
}

export const SocketEvents = {
    error: 'error',
    tournament: {
        join: 'tournament::join',
        joined: 'tournament::joined',
        leave: 'tournament::leave',
        win: 'tournament::win',
        loose: 'tournament::loose',
        bracket: 'tournament::bracket',
        ready: 'tournament::ready',
        start: 'tournament::start',
        create: 'tournament::create',
    },
    match: {
        start: 'start_match',
        pvp: 'matchmake::pvp',
    }
}

export interface GameType {
    isTournament: boolean,
    gameMode: GameMode;
    vid: number;
    player1: Player,
    player2: Player,
    setVid: (vid: number) => void;
    scoreLimit: number;
    isGamePaused: boolean;
    opponent: User | null;
    setOpponent: (info: User | null) => void;
    setIsGamePaused: (isPaused: boolean) => void;
    ballSpeed: number;
    paddleSize: number;
    ballSize: number;
    backgroundEnabled: boolean;
    isOnline: boolean;
    setBackgroundEnabled: (enable: boolean) => void;
    setBallSpeed: (speed: number) => void;
    setOnline: (isOnline : Boolean) => void;
    setBallSize: (size: number) => void;
    setPaddleSize: (size: number) => void;
    setGameMode: (mode: GameMode) => void;
    setScoreLimit: (score: number) => void;
    gameTime: number;
    setGameTime: (time: number) => void;
    backgroundImage: string;
    setBackgroundImage: (image: string) => void;
    // setPlayer1Name: (name: string) => void;
    // setPlayer1PaddleColor: (color: string) => void;
    // setPlayer1Avatar: (avatar: string) => void;
    // setPlayer1Score: (score: number) => void;
    // setPlayer2Name: (name: string) => void;
    // setPlayer2PaddleColor: (color: string) => void;
    // setPlayer2Avatar: (avatar: string) => void;
    // setPlayer2Score: (score: number) => void;
}

export interface Coords {
    x: number;
    y: number;
}

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context)
        throw new Error('Game context required');
    return context;
}

const defaultPlayer: Player = new Player({
    name: "",
    paddleColor: '#00b8db',
    avatar: '/default.png',
    score: 0,
    setName: () => {},
    setPaddleColor: () => {},
    setAvatar: () => {},
    setScore: () => {},
});

export const GameContext = createContext<GameType>({
    isTournament: false,
    vid: 0,
    setVid: () => {},
    gameMode: GameMode.CLASSIC,
    scoreLimit: 10,
    isGamePaused: false,
    backgroundEnabled: false,
    setBackgroundEnabled: (enable: boolean) => {},
    backgroundImage: '',
    setIsGamePaused: () => {},
    ballSpeed: 5,
    paddleSize: 110,
    opponent: null,
    setOpponent : () => {},
    ballSize: 10,
    isOnline: false,
    setOnline: () => {},
    setBallSpeed: () => {},
    setBallSize: () => {},
    setPaddleSize: () => {},
    setGameMode: (mode: GameMode) => {},
    setScoreLimit: (score: number) => {},
    gameTime: 0,
    setGameTime: (time: number) => {},
    setBackgroundImage: (image: string) => {},
    player1: defaultPlayer,
    player2: defaultPlayer,
    // setPlayer1Name: () => {},
    // setPlayer1PaddleColor: () => {},
    // setPlayer1Avatar: () => {},
    // setPlayer1Score: () => {},
    // setPlayer2Name: () => {},
    // setPlayer2PaddleColor: () => {},
    // setPlayer2Avatar: () => {},
    // setPlayer2Score: () => {}
});

export interface GamePreferences {
    paddleColor: string;
    backgroundImage: string;
    paddleSize: number;
    ballColor: string;
    ballSpeed: number;
    ballSize: number;
    bgIndex: number;
    showBg: boolean;
    mode: GameMode;
}

export interface Logtime {
    day: string,
    time: number,
}

export interface User {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    language: string,
    bio: string,
    profile_image?: string,
    cover: string,
    created_at: string,
    match_count: number,
    win_count: number,
    lose_count: number,
    win_rate: number,
    friends_count: number,
    leaderboard: User[],
    two_factor_enabled: boolean,
    email: string,
    rank: number,
    lvl: number,
    score: number,
    alias?: string | null,
    isGoogleLogin: boolean,
    logtime?: Logtime[],
}

export interface SearchResult extends User {
    friendship_status?: string;
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context)
        throw new Error('User context required');
    return context;
}

// user and set User type
export interface UserProviderProps {
    user: User;
    setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<UserProviderProps>({
    user: {
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
        language: "en",
        bio: "",
        profile_image: "",
        created_at: "",
        cover: "",
        win_count: 0,
        win_rate: 0,
        match_count: 0,
        lose_count: 0,
        friends_count: 0,
        leaderboard: [],
        two_factor_enabled: false,
        email: "",
        rank: 0,
        lvl: 0,
        score: 0,
        isGoogleLogin: false
    },
    setUser: () => {}
}
);



// User provider
export const UserProvider =  ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>({
        id: 0,
        username: "",
        first_name: "",
        last_name: "",
        language: "en",
        bio: "",
        profile_image: "",
        created_at: "",
        cover: "",
        win_count: 0,
        win_rate: 0,
        match_count: 0,
        lose_count: 0,
        friends_count: 0,
        leaderboard: [],
        two_factor_enabled: false,
        email: "",
        rank: 0,
        lvl: 0,
        isGoogleLogin: false,
        score: 0,
        alias: null,
    });

    const u : UserProviderProps = {
        user,
        setUser
    }


    const {player1} = useGame();
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        // ... existing useEffect logic ...
        const fetchProfile = async () => {
            try {
                const res = await fetchWithToken(`${baseUrl}/api/settings/profile`, { method: 'GET' });
                if (!res.ok) throw new Error('Unauthorized');
                const data = await res.json();

                setUser(prevUser => ({
                    ...prevUser,
                    ...data.user,
                    alias: prevUser.alias ?? data.user.alias,
                }));

                console.log("Alias => ", user.alias);
                player1.setName (data.user.username); // Update player1 name directly

                // Update i18n language when user is loaded
                if (user.language && i18n.language !== user.language) {
                    i18n.changeLanguage(user.language);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("language", data.user.language);
                    }
                }
            } catch (e) {
                console.error("Error fetching profile:", e);
                router.replace('/auth?mode=sign-in');
            }
        };

        if (pathname.startsWith('/auth') === false) {
            if (!localStorage.getItem('accessToken')) {
                router.replace('/auth?mode=sign-in');
                return;
            }
            console.log("Fetching user profile...", pathname);
            // if (!user || user.id === 0 )
            fetchProfile();
        }
    }, [pathname]);

    return (
        <UserContext.Provider value={u}>
            {children}
        </UserContext.Provider>
    );
}

export const FriendshipStatus = {
  none: "none",
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
}
