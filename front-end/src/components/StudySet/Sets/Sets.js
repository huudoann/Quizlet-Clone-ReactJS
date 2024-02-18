import React, { useState } from 'react';
import './Sets.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

const Sets = () => {
    // sửa UI
    // code dựa trên data fake


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
        <div className="sets">
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

            <div className='body-sets'>
                <div className='user-profile'>
                    <img src='https://e7.pngegg.com/pngimages/7/618/png-clipart-man-illustration-avatar-icon-fashion-men-avatar-face-fashion-girl-thumbnail.png' alt='Avatar' className='avatar' />
                    <span className='username'>Tên người dùng</span>
                </div>
                <div className='select-card'>
                    <div className='term'>Học phần</div>
                    <div className='folder'>Thư mục</div>
                </div>
                <div className='search-term'>
                    <input type="text" placeholder="Tìm kiếm học phần" />
                    {/* <div className='icon-search'>
                        <FontAwesomeIcon icon={faSearch} />
                    </div> */}
                </div>
            </div>
        </div>
    );

}

export default Sets;