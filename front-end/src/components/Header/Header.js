import React, { useState, useEffect, useRef } from 'react';
import { createSvgIcon } from '@mui/material/utils';
import PersonIcon from '@mui/icons-material/Person';
import './Header.scss';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Button, Input } from '@mui/material';
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
    const location = useLocation();
    const menuRef = useRef(null); // Ref cho menu
    const menuUserRef = useRef(null); // Ref cho menu người dùng

    const isActive = location.pathname.includes('folders') || location.pathname.includes('sets');

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
                <div className='home-library-container'>
                    <Link to="/lastest" style={{ color: 'inherit', textDecoration: 'inherit', border: 'none' }}>
                        <Button className="name-app" sx={{ textTransform: 'none' }}>Quizlet</Button>
                    </Link>

                    <NavLink to={"/lastest"} className="homepage-btn" activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0.5rem' }}>
                        <Button style={{ color: 'white' }}>Trang chủ</Button>
                    </NavLink>

                    <NavLink to={"/sets"} className={isActive ? "library-btn active" : "library-btn"} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0.5rem', marginRight: '1rem' }}>
                        <Button style={{ color: 'white' }}>Thư viện</Button>
                    </NavLink>
                </div>

                <div className="search">
                    <Input type="text" placeholder="Search for anything..." style={{ width: '100%', border: 'none !important' }} />
                    <div className="button-right">
                        <div className="icon-container icon-container-plus" onClick={toggleMenu}>
                            <PlusIcon />
                            {isMenuOpen && (
                                <div ref={menuRef} className="menu" onClick={(e) => e.stopPropagation()}>
                                    <Link to="/create-set" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                        <Button className="menu-item" sx={{ textTransform: 'none' }}><FontAwesomeIcon icon={faStickyNote} /> Học phần </Button>
                                    </Link>
                                    <Button className="menu-item" onClick={toggleFolderDialog} sx={{ textTransform: 'none' }}><FontAwesomeIcon icon={faFolder} /> Thư mục </Button>
                                </div>
                            )}
                        </div>

                        <div className="icon-container icon-container-user" onClick={toggleUserMenu}>
                            <PersonIcon />
                            {isUserMenuOpen && (
                                <div ref={menuUserRef} className="menu" onClick={(e) => e.stopPropagation()}>
                                    {/* Thêm các menu item cho menu người dùng ở đây */}

                                    <Button className="menu-item" sx={{ textTransform: 'none' }}><FontAwesomeIcon icon={faUser} />
                                        <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit' }} >Hồ sơ</Link>

                                    </Button>

                                    <Button className="menu-item" sx={{ textTransform: 'none' }}><FontAwesomeIcon icon={faCog} />Cài đặt</Button>

                                    <Button className="menu-item" sx={{ textTransform: 'none' }}><Link to="/tos" style={{ color: 'inherit', textDecoration: 'inherit' }}>Quyền riêng tư</Link>
                                    </Button>

                                    <Button className="menu-item" sx={{ textTransform: 'none' }} onClick={handleLogout}>Đăng xuất</Button>
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
