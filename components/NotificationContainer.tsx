import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationType } from '../types';

const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  const getIcon = (type: NotificationType) => {
    switch(type) {
      case 'success':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'info':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'error':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default:
        return null;
    }
  };

  const getBorderColor = (type: NotificationType) => {
      switch(type) {
          case 'success': return 'border-green-500/30';
          case 'info': return 'border-blue-500/30';
          case 'error': return 'border-red-500/30';
          default: return 'border-slate-700';
      }
  }

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-xs">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`bg-slate-800 border ${getBorderColor(notification.type)} rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-section`}
          style={{animationDelay: '0ms', animationDuration: '0.3s'}}
        >
          {getIcon(notification.type)}
          <p className="text-white text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
