import React, { useState } from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    }

    return (
        <div className='nav-header'>
            <header>
                <div className="name-app">Quizlet</div>

                <div className='home-library-container'>

     {/* Phần slash của Home trong trang Header.js và Quizlet trong trang Home.js đang đảo nhau để fake đăng nhập */}

                    <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit'}}>   
                        <div className='homepage-btn'>Home</div>
                    </Link>
                    <Link to="/sets" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                        <div className='library-menu'>Library</div>
                    </Link>
                </div>

                <div className="search">
                    <input type="text" placeholder="Search for anything..." />
                    <div className="button-right">
                        <div className="icon-container icon-container-plus" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faPlus}
                                className='faPlus' />
                            {isMenuOpen && (
                                <div className="menu">
                                    <Link to="/create-set" style={{ color: 'inherit', textDecoration: 'inherit'}}>
                                        <div className="menu-item"><FontAwesomeIcon icon={faStickyNote} /> Học phần </div>
                                    </Link>
                                    <div className="menu-item" onClick={toggleFolderDialog}><FontAwesomeIcon icon={faFolder} /> Thư mục </div>
                                    <div className="menu-item"><FontAwesomeIcon icon={faUsers} /> Lớp </div>
                                </div>
                            )}
                        </div>
                        <div className="icon-container icon-container-bell">
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <div className="icon-container icon-container-user">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                </div>
            </header >

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
        </div >
    );
}

export default Header