import React, { useState, useEffect } from 'react';
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [overlayTexts, setOverlayTexts] = useState(["", ""]);
    const images = [
        "https://assets.quizlet.com/_next/static/media/search.644f9363.png",
        "https://assets.quizlet.com/_next/static/media/learn.10aa3771.png",
        "https://assets.quizlet.com/_next/static/media/test.a8904e86.svg"
    ];

    const texts = [
        ["Tìm kiếm mạnh mẽ hơn", "Tìm thẻ ghi nhớ bạn cần để học về bất kì chủ đề nào"],
        ["Cải thiện điểm số với chế độ Học", "Học với các câu hỏi hay hơn, kiểm soát nhiều hơn, và gợi ý"],
        ["Hãy sẵn sàng cho kì thi", "Kiểm tra với gợi ý và chỉ dẫn học được tăng cường bởi AI"]
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    // useEffect(() => {
    //     setOverlayTexts(texts[currentImageIndex]);
    // }, [currentImageIndex, texts]);

    useEffect(() => {
        const newOverlayTexts = texts[currentImageIndex];
        setOverlayTexts(prevOverlayTexts => {
            // So sánh nếu state mới giống với state trước đó thì không cần cập nhật
            if (prevOverlayTexts[0] === newOverlayTexts[0] && prevOverlayTexts[1] === newOverlayTexts[1]) {
                return prevOverlayTexts;
            }
            return newOverlayTexts;
        });
    }, [currentImageIndex, texts]);

    return (
        <div className="home-page">
            {<Header />}

            <div className='content'>
                <div className="start-learn">
                    <img src={images[currentImageIndex]} alt="Start learning" />
                    <div className="text-overlay">
                        <p>{overlayTexts[0]}</p>
                        <p>{overlayTexts[1]}</p>
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
