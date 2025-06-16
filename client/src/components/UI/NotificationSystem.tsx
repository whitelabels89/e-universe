import { useState, useEffect } from "react";

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

let notificationId = 0;
let notificationListeners: ((notification: Notification) => void)[] = [];

export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
  const notification: Notification = {
    id: `notification-${++notificationId}`,
    message,
    type,
    duration
  };
  
  notificationListeners.forEach(listener => listener(notification));
};

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      setNotifications(prev => [...prev, notification]);
      
      // Auto remove after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, notification.duration);
    };

    notificationListeners.push(handleNotification);
    
    return () => {
      notificationListeners = notificationListeners.filter(l => l !== handleNotification);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-md border pointer-events-auto
            transform transition-all duration-300 ease-in-out
            ${notification.type === 'success' 
              ? 'bg-green-500/20 border-green-400/30 text-green-100' 
              : notification.type === 'error'
                ? 'bg-red-500/20 border-red-400/30 text-red-100'
                : 'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }
          `}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              {notification.type === 'success' && '✓'}
              {notification.type === 'error' && '✗'}
              {notification.type === 'info' && 'ℹ'}
            </div>
            <div className="text-sm font-medium">
              {notification.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}