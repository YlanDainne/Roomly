import React from 'react';
import { usePopup } from '../context/PopupContext';
import './Popup.css';

const Popup = () => {
  const { popupState, hidePopup } = usePopup();

  if (!popupState.isOpen) return null;

  return (
    <div className="popup-overlay" onClick={hidePopup} role="presentation">
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h3 className="popup-title">{popupState.title}</h3>
        <p className="popup-message">{popupState.message}</p>
        <button className="popup-btn" onClick={hidePopup} type="button">
          OK
        </button>
      </div>
    </div>
  );
};

export default Popup;
