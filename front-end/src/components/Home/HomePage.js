import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    }

    return (
        <div className="home-page">
            <header>
                <div className="name-app">Quizlet</div>
                <div className="search">
                    <input type="text" placeholder="Tìm kiếm" />
                    <div className="button-right">
                        <div className="icon-container" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faPlus} />
                            {isMenuOpen && (
                                <div className="menu">
                                    <div className="menu-item"><FontAwesomeIcon icon={faStickyNote} /> Học phần </div>
                                    <div className="menu-item" onClick={toggleFolderDialog}><FontAwesomeIcon icon={faFolder} /> Thư mục </div>
                                    <div className="menu-item"><FontAwesomeIcon icon={faUsers} /> Lớp </div>
                                </div>
                            )}
                        </div>
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faUser} />
                        </div>
                    </div>
                </div>
            </header>

            {isFolderDialogOpen && (
                <div className="folder-dialog">
                    <div className="close-icon" onClick={toggleFolderDialog}>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    <h2>Tạo thư mục mới</h2>
                    <input type="text" placeholder="Tên thư mục" />
                    <input type="text" placeholder="Mô tả" />
                    <button onClick={toggleFolderDialog}>Tạo thư mục</button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
