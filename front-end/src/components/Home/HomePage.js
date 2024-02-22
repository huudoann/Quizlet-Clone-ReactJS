import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';
import {faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Header from '../Header/Header';

const HomePage = () => {
    // sửa lại UI
    // logic các nút, bao gồm gửi về server
    // thêm footer


    return (
        <div className="home-page">
            <Header/>

            <body>
                <footer>
                    <div className="footer">
                        <div className="row">
                            <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                        </div>

                        <div className="row">
                            <ul>
                                <li><a href="#">Contact us</a></li>
                                <li><a href="#">Our Services</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms & Conditions</a></li>
                                <li><a href="#">Career</a></li>
                            </ul>
                        </div>

                        <div className="row">
                            QUIZLET Copyright © 2024 Quizlet - All rights reserved
                        </div>
                    </div>
                </footer>
            </body>
        </div>
    );
}

export default HomePage;
