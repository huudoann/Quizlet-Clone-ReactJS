import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Button, Menu, MenuItem, Divider } from '@mui/material';
import { KeyboardArrowDown, Home, ContentCopy, AutoMode, Quiz, Compare } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const CustomizedButton = styled(Button)(({ theme }) => ({
    padding: '1rem 0',
    minWidth: '200px',
    fontSize: '1rem',
    borderRadius: '6px',
    color: 'white',
    backgroundColor: 'inherit',
    '&:hover': {
        backgroundColor: alpha('#f0f0f0;', 0.2),
        boxShadow: '0 0 0 1px #fff inset',
    },
}));

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: '#262645',
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 240,
        color:
            theme.palette.mode === 'light' ? 'inherit' : theme.palette.grey[100],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            color: 'white',
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: 'inherit',
                marginRight: theme.spacing(1.5),
            },
            '&:hover': {
                backgroundColor: alpha('#f0f0f0;', 0.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

export default function CustomizedMenus() {
    const location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <CustomizedButton
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}

            >
                <Compare style={{ paddingRight: '10px' }} />
                Match
            </CustomizedButton>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem component={Link} to={`/flashcard`} onClick={handleClose} disableRipple>
                    <ContentCopy />
                    Flashcard
                </MenuItem>
                <MenuItem component={Link} to={`/learn`} onClick={handleClose} disableRipple>
                    <AutoMode />
                    Learn
                </MenuItem>
                <MenuItem component={Link} to={`/test`} onClick={handleClose} disableRipple>
                    <Quiz />
                    Test
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem component={Link} to="/lastest" onClick={handleClose} disableRipple>
                    <Home />
                    Home
                </MenuItem>
            </StyledMenu>
        </div>
    );
}