import React, { useState } from "react";

interface PopupProps {
    status: boolean;
    togglePopup: () => void;
    callback: (color: string) => void;
}


const Popup: React.FC<PopupProps> = ({ status, togglePopup, callback }) => {
    const [color, setColor] = useState('#FFFFFF')
    function handleSubmit() {
        callback(color)
        togglePopup();
        
    }
    return (
        <div className={status ? 'popup popup--active' : 'popup'}>
            <div onClick={togglePopup} className="popup__layout"></div>
            <div className="popup__content">
                <button className="popup__close" onClick={togglePopup}>
                    X
                </button>
                <input value={color} onChange={(e) => setColor(e.target.value)}  className="popup__input"/>
                <button onClick={handleSubmit} className="popup__button">Установить цвет</button>
            </div>
        </div>
    );
};
export default Popup;