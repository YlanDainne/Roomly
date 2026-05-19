import React, { createContext, useContext, useState, useCallback } from 'react';

const PopupContext = createContext(null);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    message: '',
    title: 'Notification',
  });

  const showPopup = useCallback((message, title = 'Notification') => {
    setPopupState({
      isOpen: true,
      message,
      title,
    });
  }, []);

  const hidePopup = useCallback(() => {
    setPopupState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup, popupState }}>
      {children}
    </PopupContext.Provider>
  );
};
