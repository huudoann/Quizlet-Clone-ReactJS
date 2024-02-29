import React, { useState, useEffect, useRef } from 'react';
import { createSvgIcon } from '@mui/material/utils';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import './Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null); // Ref cho menu

    const handleLibraryClick = async () => {
        let token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');

        try {
            // Kiểm tra xem token có tồn tại không
            if (!token) {
                throw new Error('Token không tồn tại trong localStorage');
            }

            const response = await axios.get(`http://localhost:8080/api/set/${userId}/sets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            console.log("Lấy dữ liệu thành công");

            navigate(`/sets?sets=${encodeURIComponent(JSON.stringify(response.data))}`);

        } catch (error) {
            console.error('Lỗi khi lấy danh sách các set:', error.message);
            throw error;
        }
    };

    useEffect(() => {
        // Hàm xử lý sự kiện click ra ngoài menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false); // Đóng menu nếu click ra ngoài
            }
        };

        // Thêm sự kiện nghe click vào document
        document.addEventListener('click', handleClickOutside);

        // Cleanup function để loại bỏ sự kiện nghe khi component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []); // [] đảm bảo useEffect chỉ chạy một lần sau khi component mount

    const toggleMenu = (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    };

    const PlusIcon = createSvgIcon(
        // credit: plus icon from https://heroicons.com/
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>,
        'Plus',
    );

    return (
        <div className='nav-header'>
            <header>
                <Link to="/lastest" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <div className="name-app">Quizlet</div> </Link>

                <div className='home-library-container'>
                    <Link to="/lastest" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                        <div className='homepage-btn'>Home</div>
                    </Link>
                    <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit' }} onClick={handleLibraryClick}>
                        <div className='library-menu' onClick={handleLibraryClick}>Library</div>
                    </Link>
                </div>

                <div className="search">
                    <input type="text" placeholder="Search for anything..." />
                    <div className="button-right">
                        <div className="icon-container icon-container-plus" onClick={toggleMenu}>
                            <PlusIcon />
                            {isMenuOpen && (
                                <div ref={menuRef} className="menu" onClick={(e) => e.stopPropagation()}>
                                    <Link to="/create-set" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        <div className="menu-item"><FontAwesomeIcon icon={faStickyNote} /> Học phần </div>
                                    </Link>
                                    <div className="menu-item" onClick={toggleFolderDialog}><FontAwesomeIcon icon={faFolder} /> Thư mục </div>
                                    <div className="menu-item"><FontAwesomeIcon icon={faUsers} /> Lớp </div>
                                </div>
                            )}
                        </div>
                        <div className="icon-container icon-container-bell">
                            <NotificationsIcon />
                        </div>
                        <div className="icon-container icon-container-user">
                            <PersonIcon />
                        </div>
                    </div>
                </div>
            </header>

            {isFolderDialogOpen && (
                <div className="folder-dialog">
                    <div className="close-icon" onClick={toggleFolderDialog}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <h2>Create new folder</h2>
                    <input type="text" placeholder="Folder name" />
                    <input type="text" placeholder="Description" />
                    <button onClick={toggleFolderDialog}>Create</button>
                </div>
            )}
        </div>
    );
}

export default Header;
