'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageCircle, Users, Gamepad2, X, Trophy } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { SocketEvents } from '@/app/types';

const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, socket, markAsRead, deleteNotification, clearAll, unreadCount, isConnected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'friend':
        return <Users className="w-4 h-4 text-green-400" />;
      case 'invite':
      case 'game':
        return <Gamepad2 className="w-4 h-4 text-purple-400" />;
      case 'tournament':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return t('notifications.unknownTime');
    }
  };

  const handleNotificationClick = (notification: any, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.delete-button')) {
      return;
    }

    setIsOpen(false);
    switch (notification.type) {
      case 'message':
        if (!notification.read) {
          markAsRead(notification.id);
        }
        router.push(`/Chat?contact=${notification.sender_id}`);
        break;
      case 'friend':
        if (!notification.read) {
          markAsRead(notification.id);
        }
        router.push('/friends');
        break;
      case 'invite':
      case 'game':
        if (notification.read) {
          alert(t('notifications.gameAlreadyPlayed') || 'This game invite was already played!');
          return;
        }
        markAsRead(notification.id);
        socket?.emit("matchmake::pvp", notification.sender_id);
        break;
      case 'tournament':
        if (!notification.read) {
          markAsRead(notification.id);
        }
        break;
      default:
        if (!notification.read) {
          markAsRead(notification.id);
        }
        router.push('/Home');
        break;
    }
  };

  const handleDeleteNotification = (notificationId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    deleteNotification(notificationId);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative  p-2 rounded-full  hover:bg-cyan-500/20 transition-colors duration-200 group"
        aria-label="Notifications"
      >
        <Bell
          className={`md:size-8  group-hover:text-cyan-400 transition-colors duration-200 text-cyan-500`}
        />
        {unreadCount > 0 && isConnected && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-sm bg-[#081C29] border border-[#21364a] rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#21364a]">
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold text-lg">
                {t('notifications.notifications')}
              </h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}
                   title={isConnected ? t('notifications.connected') : t('notifications.disconnected')} />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#21364a]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400 text-sm">{t('notifications.noNotificationsYet')}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={(e) => handleNotificationClick(notification, e)}
                  className={`p-4 border-b border-[#21364a]/50 hover:bg-[#21364a]/30 cursor-pointer transition-all duration-200 active:bg-[#21364a]/50 group ${
                    !notification.read ? 'bg-[#00F5FF]/5 border-l-4 border-l-[#00F5FF]' : ''
                  }`}
                  title={`${notification.type === 'message' ? t('notifications.clickToGoToChat') : notification.type === 'friend' ? t('notifications.clickToGoToFriends') : t('notifications.clickToGoToGame')}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 capitalize">
                            {notification.type}
                          </span>
                          {!notification.read ? (
                            <div className="w-2 h-2 bg-[#00F5FF] rounded-full animate-pulse" title={t('notifications.unread')}></div>
                          ) : (
                            <div className="w-2 h-2 bg-gray-500 rounded-full" title={t('notifications.read')}></div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 bg-[#21364a]/20 border-t border-[#21364a]">
              <p className="text-xs text-gray-400 text-center">
                {unreadCount > 0
                  ? `${unreadCount} ${unreadCount > 1 ? t('notifications.unreadNotifications') : t('notifications.unreadNotification')}`
                  : t('notifications.allCaughtUp')
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;