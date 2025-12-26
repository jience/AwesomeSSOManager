import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Toast, ToastContainer, ToastType } from '../components/UI';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface NotificationContextType {
  addToast: (type: ToastType, title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, type, title, message }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={dismissToast}
          />
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};
