import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert, Fade, Snackbar } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface SnackbarContextType {
    showSnackbar: (message: string, newIcon: ReactNode) => void;
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
    const [icon, setIcon] = useState<ReactNode>(<CheckCircleOutlineIcon fontSize="small" />)

    const showSnackbar = (newMessage: string, newIcon: ReactNode) => {
        setMessage(newMessage);
        setIsVisible(true);
        if (newIcon) {
            setIcon(newIcon)
        }
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
                autoHideDuration={2000}
                ContentProps={{
                    sx: {
                        background: "#4CAF50"
                    }
                }}
            >
                <Alert icon={icon} variant="filled" severity="success">
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}