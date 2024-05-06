import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Fade, Snackbar } from "@mui/material";

interface SnackbarContextType {
    showSnackbar: (message: string) => void;
    hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
};

interface Props {
    children?: ReactNode
}

export function SnackbarProvider({ children }: Props) {
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const showSnackbar = (newMessage: string) => {
        setMessage(newMessage);
        setIsVisible(true);
    };

    const hideSnackbar = () => {
        setIsVisible(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
            {children}
            <Snackbar
                open={isVisible}
                onClose={hideSnackbar}
                TransitionComponent={Fade}
                message={message}
                autoHideDuration={2000}
            />
        </SnackbarContext.Provider>
    )
}