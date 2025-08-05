import React, { useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X, type LucideIcon } from 'lucide-react';

import type { ReactNode } from 'react';


import { NotificationContext, } from './NotificationContext';
import type { NotificationContextType, NotificationType } from './NotificationContext';

interface NotificationData {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  className: string;
  icon: LucideIcon;
}

const defaultConfig: Record<NotificationType, Omit<NotificationData, 'id' | 'type'>> = {
  success: {
    icon: CheckCircle,
    className: 'bg-gradient-to-r from-green-500 to-green-600',
    title: 'Success!',
    message: 'Your action was completed successfully.',
  },
  error: {
    icon: XCircle,
    className: 'bg-gradient-to-r from-red-500 to-red-600',
    title: 'Error!',
    message: 'Something went wrong. Please try again.',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-gradient-to-r from-orange-500 to-orange-600',
    title: 'Warning!',
    message: 'Please check your input and try again.',
  },
  info: {
    icon: Info,
    className: 'bg-gradient-to-r from-blue-500 to-blue-600',
    title: 'Information',
    message: 'Here is some important information for you.',
  },
};

let idCounter = 1;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback<NotificationContextType['showNotification']>(
    (type, override) => {
      const base = defaultConfig[type];
      const notification: NotificationData = {
        id: idCounter++,
        type,
        title: override?.title || base.title,
        message: override?.message || base.message,
        className: base.className,
        icon: base.icon,
      };

      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 4000);
    },
    []
  );

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationList notifications={notifications} remove={removeNotification} />
    </NotificationContext.Provider>
  );
};

interface NotificationListProps {
  notifications: NotificationData[];
  remove: (id: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, remove }) => (
  <div className="fixed top-0 left-0 w-full pointer-events-none z-50">
    {notifications.map((notification, index) => (
      <div
        key={notification.id}
        style={{ top: `${20 + index * 90}px` }}
        className="relative pointer-events-auto"
      >
        <NotificationItem notification={notification} onRemove={remove} />
      </div>
    ))}
  </div>
);

interface NotificationItemProps {
  notification: NotificationData;
  onRemove: (id: number) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const Icon = notification.icon;

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 10);
  }, []);

  return (
    <div
      className={`fixed w-80 transition-all duration-1000 ease-in-out ${
        isAnimating
          ? 'left-1/2 transform -translate-x-1/2 animate-slideInPauseOut'
          : '-left-96 opacity-0'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.className}`}>
          <Icon size={16} className="text-white" />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm mb-1">{notification.title}</h4>
          <p className="text-gray-600 text-xs leading-relaxed">{notification.message}</p>
        </div>

        <button
          onClick={() => onRemove(notification.id)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={14} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>
    </div>
  );
};