import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

import classes from './Appbar.module.scss';
import { Logout, History, PersonOutline } from '@mui/icons-material';

function Appbar() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    useEffect(() => {
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <AppBar position="static" className={classes.appbar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="body1" component="div" className={classes.appName} onClick={() => navigate("/")}>
                    SpeedTyper
                </Typography>
                {!user && !loading &&
                    <Button href="/login" className={classes.loginButton}>Login</Button>
                }
                {user &&
                    <>
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>{user.firstName[0]}</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            disableScrollLock={true}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={() => navigate('/profile')}>
                                <ListItemIcon>
                                    <PersonOutline sx={{ width: 24, height: 24 }} />
                                </ListItemIcon>
                                <Typography variant="caption">View Profile</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/scores')}>
                                <ListItemIcon>
                                    <History sx={{ width: 24, height: 24 }} />
                                </ListItemIcon>
                                <Typography variant="caption">History</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <Logout sx={{ width: 24, height: 24 }} />
                                </ListItemIcon>
                                <Typography variant="caption">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </>
                }
            </Toolbar>
        </AppBar>
    )
};

export default Appbar;