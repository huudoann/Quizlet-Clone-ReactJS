import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const HomePage = () => {
    // sửa lại UI
    // logic các nút, bao gồm gửi về server
    // thêm footer


    return (
        <div className="home-page">
            <Header />

            <body>
            </body>
            <Footer />
        </div>
    );
}

export default HomePage;
