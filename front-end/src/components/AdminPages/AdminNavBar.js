import React, { useState } from "react";
import { Button, ButtonGroup } from '@mui/material';
import { Home, Leaderboard, Person, PersonSearch, TableChart } from '@mui/icons-material';
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

    // const handleStudentTable = () => {
    //     navigate('/student_table');
    // }

    // const handleExamstatistic = () => {
    //     navigate('/exam_statistic');
    // }

    // const handleStudentInfo = () => {
    //     navigate('/search_student_informations');
    // }

    const handleNavigateUserPage = () => {
        navigate('/lastest');
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: '#dc3545', padding: '.25rem .5rem' }}>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <Button
                    className="nav-btn"
                    onClick={handleHomePage}
                    style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <Home style={{ marginRight: '.25rem' }} />
                    Trang chủ
                </Button>

                <Button
                    className="nav-btn"
                    onClick={handleNavigateUserPage}
                    style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <Leaderboard style={{ marginRight: '.25rem' }} />
                    Chuyển sang giao diện người dùng
                </Button>


                {/* <Button
                    className="nav-btn"
                    onClick={handleStudentTable}
                    style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <Leaderboard style={{ marginRight: '.25rem' }} />
                    Thống kê điểm sinh viên
                </Button>

                <Button
                    className="nav-btn"
                    onClick={handleExamstatistic}
                    style={{ backgroundColor: 'inherit', color: '#fff', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <TableChart style={{ marginRight: '.25rem' }} />
                    Thống kê theo kỳ thi
                </Button>

                <Button
                    className="nav-btn"
                    onClick={handleStudentInfo}
                    style={{ backgroundColor: 'inherit', color: '#fff', margin: '0 .25rem', borderRadius: '1rem', border: 'none', padding: '.25rem .5rem' }}
                >
                    <PersonSearch style={{ marginRight: '.25rem' }} />
                    Tra cứu sinh viên
                </Button> */}
            </ButtonGroup>
            <ButtonGroup variant="text" aria-label="Basic button group">
                <AdminProfileMenu className="nav-btn" style={{ backgroundColor: '#dc3545', color: '#fff', margin: '0.5rem .5rem', borderRadius: '5rem', padding: '.25rem .5rem' }} onClick={toggleProfileMenu}> <Person /> </AdminProfileMenu>
            </ButtonGroup>
        </div>
    );
};

export default NavBar;