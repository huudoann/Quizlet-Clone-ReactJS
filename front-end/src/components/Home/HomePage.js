import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes } from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    // sửa lại UI
    // logic các nút, bao gồm gửi về server
    // thêm footer


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleFolderDialog = () => {
        setIsFolderDialogOpen(!isFolderDialogOpen);
    }

    const toggleLibraryMenu = () => {
        setIsLibraryMenuOpen(!isLibraryMenuOpen);
    }


    return (
        <div className="home-page">
            <header>
                <div className="name-app">Quizlet</div>

                <div className='home-library-container'>
                    <div className='homepage-btn'>Home</div>
                    <div className='library-menu' onClick={toggleLibraryMenu}>Library</div>
                    {isLibraryMenuOpen && (
                        <div className="library-menu-dropdown">
                            <div className="menu-item1">Study sets</div>
                            <div className="menu-item1">Folders</div>
                        </div>
                    )}
                </div>



                <div className="search">
                    <input type="text" placeholder="Search for anything..." />
                    <div className="button-right">
                        <div className="icon-container" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faPlus} />
                            {isMenuOpen && (
                                <div className="menu">
                                    <div className="menu-item"><FontAwesomeIcon icon={faStickyNote} /> Study sets </div>
                                    <div className="menu-item" onClick={toggleFolderDialog}><FontAwesomeIcon icon={faFolder} /> Folders </div>
                                    <div className="menu-item"><FontAwesomeIcon icon={faUsers} /> Classes </div>
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
                    <h2>Create new folder</h2>
                    <input type="text" placeholder="Folder name" />
                    <input type="text" placeholder="Description" />
                    <button onClick={toggleFolderDialog}>Create</button>
                </div>
            )}
        </div>
    );
}

export default HomePage;
