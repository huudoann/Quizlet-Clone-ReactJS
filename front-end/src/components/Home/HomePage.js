import React, { useState } from 'react';
import './HomePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Button from '@mui/material/Button';

const HomePage = () => {
    // sửa lại UI
    // logic các nút, bao gồm gửi về server
    // thêm footer


    return (
        <div className="home-page">
            {<Header />}

            <div className='content'>
                <div className="start-learn">
                    <img src="https://images.prismic.io/quizlet-web/MDFkMjA3YzUtMGQyNC00ZDU3LThmMDctZjljZjQ5OTg2N2M0_130dc509-6919-47bc-b27d-17f600a41b0c_intlfirstslice.png?auto=compress,format&rect=0,0,1000,683&w=1000&h=683" alt="Start learning" />
                    <div className="image-overlay">
                        <p>Ghi nhớ nhanh hơn, miễn phí !</p>
                        <Button variant="contained">Học ngay</Button>
                    </div>
                </div>

                <div className='date-calendar-container'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar className='date-calendar' />
                    </LocalizationProvider>
                </div>
            </div>

            {<Footer />}
        </div >
    );
}

export default HomePage;
