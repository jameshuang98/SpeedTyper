import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress sx={{ height: "3rem !important", width: "3rem !important" }} />
        </Box>
    );
}