
import React from 'react';
import { Bell, AlertCircle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string | number;
  type: 'warning' | 'info' | 'alert' | 'success' | string;
  message: string;
  time: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-400" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/20';
      case 'info':
        return 'bg-blue-500/20';
      case 'alert':
        return 'bg-red-500/20';
      case 'success':
        return 'bg-green-500/20';
      default:
        return 'bg-blue-500/20';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Recent Notifications</h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <div className={`p-2 rounded-lg ${getNotificationBgColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;