import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers } from '@fortawesome/free-solid-svg-icons'; // Import các icon từ thư viện Font Awesome

const HomePage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                                    <div className="menu-item"><FontAwesomeIcon icon={faFolder} /> Thư mục </div>
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
        </div>
    );
}

export default HomePage;
