import React, { useState, useEffect } from 'react';
import './HomePage.scss';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';
import axios from 'axios';
import SetItem from './SetItem';

const HomePage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [overlayTexts, setOverlayTexts] = useState(["", ""]);
    const images = [
        "https://assets.quizlet.com/_next/static/media/search.644f9363.png",
        "https://assets.quizlet.com/_next/static/media/learn.10aa3771.png",
        "https://assets.quizlet.com/_next/static/media/test.a8904e86.svg"
    ];
    const [sets, setSets] = useState([]);
    const [folders, setFolders] = useState([]);

    const texts = [
        ["Tìm kiếm mạnh mẽ hơn", "Tìm thẻ ghi nhớ bạn cần để học về bất kì chủ đề nào"],
        ["Cải thiện điểm số với chế độ Học", "Học với các câu hỏi hay hơn, kiểm soát nhiều hơn, và gợi ý"],
        ["Hãy sẵn sàng cho kì thi", "Kiểm tra với gợi ý và chỉ dẫn học được tăng cường bởi AI"]
    ];

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token không tồn tại trong localStorage');
            } else {
                try {
                    const responseSet = await axios.get(`http://localhost:8080/api/set/get-public-sets`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const responseFolder = await axios.get(`http://localhost:8080/api/folder/get-public-folders`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Lấy 10 phần tử ngẫu nhiên từ mảng sets
                    const shuffledSets = responseSet.data.sort(() => Math.random() - 0.5).slice(0, 9);
                    const shuffledFolders = responseFolder.data.sort(() => Math.random() - 0.5).slice(0, 9);

                    setSets(shuffledSets);
                    setFolders(shuffledFolders)
                    console.log(responseSet, responseFolder);
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách các set:', error.message);
                }
            }
        };

        fetchData();
    }, []);

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

                <div className="search-results-container">
                    <div className="search-results-page-container">
                        <div className="search-results-page-content">
                            <span style={{ color: '#fff', fontSize: '1.5rem' }}>Danh sách học phần:</span>
                            <div className="set-items">
                                {sets && sets.map((set, index) => (
                                    <SetItem
                                        key={index}
                                        set_id={set.set_id}
                                        title={set.title}
                                        user_id={set.user_id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="search-results-container">
                    <div className="search-results-page-container">
                        <div className="search-results-page-content">
                            <span style={{ color: '#fff', fontSize: '1.5rem' }}>Danh sách thư mục:</span>
                            <div className="set-items">
                                {folders && folders.map((folder, index) => (
                                    <SetItem
                                        key={index}
                                        set_id={folder.set_id}
                                        title={folder.title}
                                        username={folder.user}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {<Footer />}
        </div >
    );
}

export default HomePage;
