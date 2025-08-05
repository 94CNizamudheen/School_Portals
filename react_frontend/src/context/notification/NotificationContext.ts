import { createContext } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  title: string;
  message: string;
}

export interface NotificationContextType {
  showNotification: (type: NotificationType, override?: Partial<NotificationConfig>) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
