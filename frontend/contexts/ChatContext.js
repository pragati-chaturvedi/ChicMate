// ChatContext.js
import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = useState([]);

    const addMessage = (message) => {
        setChatHistory((prev) => [...prev, message]);
    };

    const clearChatHistory = () => {
        setChatHistory([]);
    };

    return (
        <ChatContext.Provider value={{ chatHistory, addMessage, clearChatHistory }}>
            {children}
        </ChatContext.Provider>
    );
};
