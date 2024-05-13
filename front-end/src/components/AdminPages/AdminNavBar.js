import React, { useState } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { Home, Person, PersonSearch, TableChart } from '@mui/icons-material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";
import AdminProfileMenu from './AdminProfileMenu';
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleHomePage = () => {
        navigate('/admin');
    }

    const handleNavigateUserPage = () => {
        navigate('/lastest');
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: '#fff', padding: '.25rem .5rem' }}>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <Button
                    className="nav-btn"
                    onClick={handleHomePage}
                    style={{ backgroundColor: '#fff', color: '#000', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <FontAwesomeIcon icon={faHouse} style={{ marginRight: '.25rem' }} />
                    Trang chủ
                </Button>

                <Button
                    className="nav-btn"
                    onClick={handleNavigateUserPage}
                    style={{ backgroundColor: '#fff', color: '#000', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: '.25rem' }} />
                    Chuyển sang giao diện người dùng
                </Button>

            </ButtonGroup>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <AdminProfileMenu className="nav-btn" style={{ backgroundColor: '#fff', color: '#000', margin: '0.5rem .5rem', borderRadius: '5rem', padding: '.25rem .5rem' }} onClick={toggleProfileMenu}> <Person /> </AdminProfileMenu>
            </ButtonGroup>
        </div>
    );
};

export default NavBar;