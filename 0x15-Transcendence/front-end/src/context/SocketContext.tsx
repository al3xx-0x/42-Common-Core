'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import {  SocketEvents, useGame, useUser } from '@/app/types';
import { usePathname, useRouter } from 'next/navigation';
import { baseUrl } from "@/app/types";
import { getPlayerProfile } from '@/app/Utils';
import {toast} from "@/hooks/use-toast";

export interface Notification {
  id: number;
  type: "message" | "friend" | "invite" | "tournament";
  content: string;
  sender_id: number;
  receiver_id: number;
  timestamp: string;
  read?: boolean;
  tournament_id?: number;
  tournament_name?: string;
  round?: number;
}

interface SocketContextType {
  socket: Socket | null;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  clearAll: () => void;
  unreadCount: number;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user , setUser} = useUser();
  useEffect(() => {
    setMounted(true);
  }, []);

  const loadPersistedNotifications = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) return;

      const response = await fetch(`${baseUrl}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.notifications) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error('Error loading persisted notifications:', error);
    }
  };

    const {setOpponent, opponent, setVid} = useGame();
    const pathname = usePathname();
    useEffect(() => {
      if (socket && !isConnected && user?.id) {
        socket?.connect();
      }
    }, [socket, isConnected, user?.id]);


    useEffect(() => {
      console.log('User alias reset due to pathname change:', pathname, ' to ', user.alias);
      if (pathname !== '/game/online' && pathname !== '/game/mode/tournament/bracket') {
        user.alias = null;
      }
      return () => {
        user.alias = null;
      }
    }, [pathname]);


    useEffect(() => {
        const doSomthing = () => {
          if (pathname !== '/game/online' && pathname !== '/game/mode/tournament/bracket') {
            socket?.emit(SocketEvents.tournament.leave);
          }

          if (['/game/online'].includes(pathname) && !opponent) {
            router.back();
          }

          if (['/game/online', '/matchmaking', '/game/mode/tournament/bracket'].includes(pathname)) return;

          if (socket && user?.id) {
              setOpponent(null);
              socket.emit("im_left", { id: user.id });
          }

        }
        doSomthing();
        return () => {
          console.log('Cleaning up on pathname change or unmount');
          socket?.off(SocketEvents.tournament.leave);
        }
    }, [pathname]);

    const router = useRouter();



  useEffect(() => {
    if (!mounted || !user?.id) {
      return;
    }


    let newSocket: Socket | null = null;

    const initializeSocket = () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        newSocket = io(`${baseUrl}`, {
          auth: {
            token: token,
            id: user.id
          },
          transports: ['websocket', 'polling'],
          autoConnect: false,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
          setIsConnected(true);
          loadPersistedNotifications();
          if (user?.id && newSocket) {
            newSocket.emit('register', user.id);
          }
        });

        newSocket.on('disconnect', (reason) => {
          setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
          setIsConnected(false);
        });

        newSocket.on(SocketEvents.tournament.start, async (data) => {
          const {vid, opponent_id, alias, opp_alias} = data;
          const opponent = await getPlayerProfile(opponent_id);
          opponent.alias = opp_alias;
          setOpponent(opponent);
          setVid(vid);
          setUser(prevUser => ({
                ...prevUser,
                alias: alias
          }));
          console.log('Starting tournament match with alias:', alias, 'and opponent alias:', opp_alias);
          router.push('/game/online');
        });

        newSocket.on(SocketEvents.match.pvp, async (data) => {
          const {vid, opponent_id} = data;
          const opponent = await getPlayerProfile(opponent_id);
          setOpponent(opponent);
          setVid(vid);
          router.push('/game/online');
        });

        newSocket.on(SocketEvents.tournament.joined, () => {
          router.push('/game/mode/tournament/bracket');
        });

        newSocket.on(SocketEvents.error, (msg) => {
          toast({description: msg, duration: 5000, variant: 'destructive'});
        });

        newSocket.on('reconnect', (attemptNumber) => {
          setIsConnected(true);
          if (user?.id && newSocket) {
            newSocket.emit('register', user.id);
          }
        });
        newSocket.on('notification', (data: Notification) => {
          setNotifications(prev => {
            const exists = prev.some(notif => notif.id === data.id);
            if (!exists) {
              return [data, ...prev];
            }
            return prev;
          });
          if (typeof window !== 'undefined' && Notification.permission === 'granted') {
            new Notification(`New ${data.type}`, {
              body: data.content,
              icon: '/favicon.ico',
              tag: `notification-${data.id}`,
            });
          }
        });

        setSocket(newSocket);

      } catch (error) {
        console.error(' Failed to initialize socket:', error);
      }
    };

    initializeSocket();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    return () => {
      if (newSocket) {
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [mounted, user?.id]);

  const markAsRead = async (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`${baseUrl}/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        console.error('Failed to mark notification as read in database');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`${baseUrl}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to delete notification from database');
        loadPersistedNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      loadPersistedNotifications();
    }
  };

  const clearAll = async () => {
    setNotifications([]);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const response = await fetch(`${baseUrl}/api/notifications/all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to clear all notifications in database');
        loadPersistedNotifications();
      }
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      loadPersistedNotifications();
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const value: SocketContextType = {
    socket,
    notifications,
    setNotifications,
    markAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

