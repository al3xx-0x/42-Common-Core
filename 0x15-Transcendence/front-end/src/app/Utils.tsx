import {baseUrl} from "@/app/types";
import { User } from "./types";

export const gradient = "bg-gradient-to-r from-[#188C71] to-[#10B6FC]"
export const gradientBorder = "border-gradient-to-r from-[#188C71] to-[#10B6FC]"

export const dark_blue = "#081C29"
export const electric_blue = "#00F5ff"

export enum Pos {
    TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT
}

export function getImageUrl(path?: string): string {
    if (path?.startsWith('/images/avatar')) return path;
    if (!path) return '/default.png';
    if (path.startsWith('http')) return path;
    return `${baseUrl}${path}`;
}

export function setCookie(name: string, value: string, days: number) {
    const date = new Date();
    // Current date + days converted to milliseconds
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    const expires = `; expires=${date.toUTCString()}`
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

export function getCookie (name: string) {
    const value = `; ${document.cookie}`;

    const parts = value.split(`; ${name}=`);

    if (parts.length === 2)
        return decodeURIComponent(parts.pop()!.split(';').shift()!);
    return null;
}

async function refreshAccessToken() {
    const refreshResponse = await fetch(
    `${baseUrl}/api/auth/refresh`,
        {
            method: 'POST',
            credentials: "include"
        }
    )

    if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('accessToken', data.token);
        return data.token;
    }
    return null;
}

export async function fetchWithToken(url: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('accessToken');


    if (!accessToken) {
        throw new Error("Login required");
    }

    options.headers = {
        ...(options.headers || {}),
        'Authorization' : `Bearer ${accessToken}`,
    };
    options.credentials = "include";

    let response = await fetch(url, options);

    if ([403, 401].includes(response.status)) {
        // The token is expired lets refresh it and re make the request.
        const newToken = await refreshAccessToken();

        if (!newToken) {
            throw new Error("Session expired. Please log in again.");
        }

        (options.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;

        response = await fetch(url, options);
    }

    return  response;
}

export function CornerDecoration(pos: Pos) {
    const size = 100;

    const rotationMap: Record<Pos, string> = {
        [Pos.TOP_LEFT]: 'rotate-0',
        [Pos.TOP_RIGHT]: 'rotate-90',
        [Pos.BOTTOM_LEFT]: '-rotate-90',
        [Pos.BOTTOM_RIGHT]: 'rotate-180',
    };

    // Create unique gradient ID for each corner to avoid conflicts
    const gradientId = `cornerGradient-${pos}`;


    return (

    <div className={rotationMap[pos]}>
            <svg width={size} height={size}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        {
                            (pos === Pos.TOP_LEFT || pos === Pos.BOTTOM_LEFT) ?
                                <>
                                    <stop offset="0%" stopColor="#188C71" />
                                    <stop offset="100%" stopColor="#188C71" />
                                </>
                                :
                                <>
                                    <stop offset="0%" stopColor="#10B6FC" />
                                    <stop offset="100%" stopColor="#10B6FC" />
                                </>
                        }
                    </linearGradient>

                </defs>
                <path
                    d="M0,0 L0,60 L4,60 L4,4 L60,4 L60,0 Z"
                    fill={`url(#${gradientId})`}
                />
                {
                    pos === Pos.TOP_LEFT || pos === Pos.BOTTOM_RIGHT ?
                    <circle
                        cx="30"
                        cy="30"
                        r="3"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="10"
                        fill={`url(#${gradientId})`}
                        strokeLinecap="round"
                    /> : <></>
                }
            </svg>
        </div>
    );
}


export const getPlayerProfile = async (id: number) : Promise<User> => {
    const response = await fetchWithToken(
        `${baseUrl}/api/settings/profile?id=${id}`,
        {
            method: 'GET',
        }
    )
    const data = await response.json();
    return data.user;
}

export const pingServer = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${baseUrl}/ping`, { method: 'GET' });
        return res.ok; // Return true if the server responds with a 200 status
    } catch (e) {
        console.error("Server is unreachable:", e);
        return false; // Return false if the server is unreachable
    }
};

export const achievementRank = [
    {
      rank: "INITIATE",
      image: "/images/initiate.png",
      xp: 1000,
      level: "Lv01",
    },

    {
      rank: "VANGUARD",
      image: "/images/vanguard.png",
      xp: 2000,
      level: "Lv02",
    },

    {
      rank: "CHAMPION",
      image: "/images/champion.png",
      xp: 3000,
      level: "Lv03",
    },

    {
      rank: "ECLIPSE",
      image: "/images/eclipse.png",
      xp: 4000,
      level: "Lv04",
    },

    {
      rank: "ASCENDANT",
      image: "/images/ascendant.png",
      xp: 5000,
      level: "Lv05",
    },
];