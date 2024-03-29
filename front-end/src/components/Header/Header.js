import React, { useState, useEffect, useRef } from 'react';
import { createSvgIcon } from '@mui/material/utils';
import PersonIcon from '@mui/icons-material/Person';
import './Header.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote, faFolder, faTimes, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State cho menu người dùng
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const menuRef = useRef(null); // Ref cho menu
    const menuUserRef = useRef(null); // Ref cho menu người dùng

    const handleLibraryClick = () => {

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

    // useEffect để xử lý sự kiện click ra ngoài cho menu người dùng
    useEffect(() => {
        const handleClickOutsideUserMenu = (event) => {
            if (menuUserRef.current && !menuUserRef.current.contains(event.target)) {
                setIsUserMenuOpen(false); // Đóng menu người dùng nếu click ra ngoài
            }
        };

        document.addEventListener('click', handleClickOutsideUserMenu);

        return () => {
            document.removeEventListener('click', handleClickOutsideUserMenu);
        };
    }, []);

    const toggleMenu = (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        setIsMenuOpen(!isMenuOpen);
        setIsUserMenuOpen(false);
    };

    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    };

    // Hàm xử lý mở/closed menu người dùng
    const toggleUserMenu = (event) => {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const PlusIcon = createSvgIcon(
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

    const handleCreateFolder = async () => {

        const is_public = true;

        const folderData = {
            title,
            description,
            is_public: is_public,
        };

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token không tồn tại trong localStorage');
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/folder/create-folder`, folderData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Tao Folder thanh cong:", response.data);

            navigate(`/folders`);
        } catch (error) {
            console.error('Lỗi khi tao hoc phan:', error.message);
        }
    };

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
                                    {/* <div className="menu-item"><FontAwesomeIcon icon={faUsers} /> Lớp </div> */}
                                </div>
                            )}
                        </div>
                        {/* <div className="icon-container icon-container-bell">
                            <NotificationsIcon />
                        </div> */}
                        <div className="icon-container icon-container-user" onClick={toggleUserMenu}>
                            <PersonIcon />
                            {isUserMenuOpen && (
                                <div ref={menuUserRef} className="menu" onClick={(e) => e.stopPropagation()}>
                                    {/* Thêm các menu item cho menu người dùng ở đây */}
                                    <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        <div className="menu-item"><FontAwesomeIcon icon={faUser} />Hồ sơ</div>
                                    </Link>
                                    <div className="menu-item"><FontAwesomeIcon icon={faCog} />Cài đặt</div>
                                    <Link to="/tos" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        <div className="menu-item">Quyền riêng tư</div>
                                    </Link>
                                    <div className="menu-item" onClick={handleLogout}>Đăng xuất</div>
                                </div>
                            )}
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
                    <input type="text" placeholder="Folder name" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button onClick={handleCreateFolder}>Create</button>
                </div>
            )}
        </div>
    );
}

export default Header;
