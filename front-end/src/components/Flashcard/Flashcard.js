import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Star, ArrowBackIos, ArrowForwardIos, Shuffle, CropFreeTwoTone, ContentCopy, AutoMode, Quiz, Compare } from '@mui/icons-material';
import Header from '../Header/Header';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import axios from 'axios';

const Flashcard = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);                  //lật thẻ
    const [isZoomed, setIsZoomed] = useState(false);                    //phóng to thẻ
    const [shuffledFlashcards, setShuffledFlashcards] = useState([]);   //tráo thẻ
    const [isShuffled, setIsShuffled] = useState(false);                //check tráo thẻ
    const [isFront, setIsFront] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const [rating, setRating] = useState(0);
    const [hoveredStarIndex, setHoveredStarIndex] = useState(-1);
    // const [averageRating, setAverageRating] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const location = useLocation();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cardIdToDelete, setCardIdToDelete] = useState(null);
    const [newCardData, setNewCardData] = useState({
        front_text: '',
        back_text: ''
    });

    const flashcardContainerRef = useRef(null);

    const fetchData = async () => {
        try {
            const set_id = new URLSearchParams(location.search).get('set_id');
            const flashcardsData = await getCardsDataFromSet(set_id);
            setFlashcards(flashcardsData);
            const title = new URLSearchParams(location.search).get('title');
            setFlashcardTitle(title);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [location.search]);

    //Gọi API thêm thẻ
    const handleAddCard = async () => {
        try {
            let token = localStorage.getItem('token');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                window.location.href("/login")
                return null;
                // throw new Error('Token không tồn tại trong localStorage');
            }
            const set_id = new URLSearchParams(location.search).get('set_id');
            const createCardApiUrl = `http://localhost:8080/${set_id}/create_card`
            const response = await axios.post(createCardApiUrl, newCardData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Thực hiện các thao tác cập nhật giao diện sau khi thêm thẻ thành công
                console.log('Thẻ đã được thêm thành công');
                fetchData();
            } else {
                console.error('Lỗi khi thêm thẻ:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request thêm thẻ:', error.message);
        }
    };


    //Gọi API xóa thẻ
    const handleDeleteConfirmation = async (cardId) => {
        setShowConfirmation(true);
        setCardIdToDelete(cardId);
    };

    const handleConfirmDelete = async () => {
        setShowConfirmation(false);
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                window.location.href("/login")
                return null
            }
            const response = await axios.delete(`http://localhost:8080/cards/${cardIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Thực hiện các thao tác cập nhật giao diện sau khi xóa thẻ thành công
                console.log('Thẻ đã được xóa thành công');
                // Cập nhật danh sách thẻ sau khi xóa
                const updatedFlashcards = flashcards.filter(card => card.card_id !== cardIdToDelete);
                setFlashcards(updatedFlashcards);
            } else {
                console.error('Lỗi khi xóa thẻ:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request xóa thẻ:', error.message);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    };

    //Gọi API gửi đánh giá
    // const handleSubmitRating = async () => {
    //     try {
    //         let token = localStorage.getItem('token');

    //         // Kiểm tra xem token có tồn tại không
    //         if (!token) {
    //             window.location.href("/login");
    //             return null;
    //             // throw new Error('Token không tồn tại trong localStorage');
    //         }

    //         // Tính toán số điểm dựa trên số sao đã chọn
    //         const points = rating * 1; // Ví dụ: mỗi sao tương ứng với 2 điểm

    //         // Gửi số điểm đánh giá đến API
    //         const response = await axios.post('http://localhost:8080/rating', { points }, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (response.status === 200) {
    //             // Thực hiện các thao tác cập nhật giao diện sau khi gửi đánh giá thành công
    //             console.log('Đã gửi đánh giá thành công');
    //         } else {
    //             console.error('Lỗi khi gửi đánh giá:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi gửi request đánh giá:', error.message);
    //     }
    // };

    // useEffect(() => {
    //     calculateAverageRating();
    // }, [flashcards]);

    // const calculateAverageRating = () => {
    //     // Logic để tính toán số điểm trung bình từ dữ liệu
    //     const data = [/* Dữ liệu về số điểm đánh giá */];
    //     const totalPoints = data.reduce((acc, curr) => acc + curr.points, 0);
    //     const average = totalPoints / data.length;
    //     setAverageRating(average);
    // };


    const CardsData = {
        flashcards,
        creator: { name: 'test', avatar: 'https://via.placeholder.com/40' },
    };

    const { creator } = CardsData;

    //xử lí chuyển thẻ
    useEffect(() => {
        if (flashcardContainerRef.current) {
            flashcardContainerRef.current.scrollLeft = scrollPosition;
        }
    }, [scrollPosition]);

    useEffect(() => {
        if (shouldAnimate) {
            const timer = setTimeout(() => {
                setShouldAnimate(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [shouldAnimate]);

    //tráo thẻ
    useEffect(() => {
        setShuffledFlashcards(shuffleArray(flashcards));
    }, [flashcards]);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const shuffleRemainingCards = () => {
        const remainingCards = isShuffled ? shuffledFlashcards.slice(currentCardIndex) : flashcards.slice(currentCardIndex);
        const shuffledRemainingCards = shuffleArray(remainingCards);
        const newFlashcards = [...flashcards.slice(0, currentCardIndex), ...shuffledRemainingCards];
        setShuffledFlashcards(newFlashcards);
    };

    const handleShuffle = () => {
        if (!isShuffled) {
            shuffleRemainingCards();
        } else {
            setShuffledFlashcards(flashcards);
        }
        setIsShuffled(!isShuffled);
    };

    //chuyển thẻ kế tiếp
    const handleNextCard = () => {
        if (currentCardIndex < shuffledFlashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
            setIsFront(true);
            setScrollPosition(flashcardContainerRef.current.scrollLeft + flashcardContainerRef.current.offsetWidth);
            setShouldAnimate(true);
            setSlideDirection('left');
        }
    };

    //quay lại thẻ trước đó
    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
            setIsFront(true);
            setScrollPosition(flashcardContainerRef.current.scrollRight - flashcardContainerRef.current.offsetWidth);
            setShouldAnimate(true);
            setSlideDirection('right');
        }
    };

    //lật mặt trước/mặt sau thẻ
    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
        setIsFront(!isFront);
    };

    //phóng to
    const handleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    //xử lý phần đánh giá
    const handleStarHover = (index) => {
        setHoveredStarIndex(index);
    };

    const handleStarClick = (value) => {
        setRating(value);
    };

    return (
        <div>
            <Header />
            <div className='flashcard-mainContainer'>
                <div className="flashcard-container" ref={flashcardContainerRef}>
                    <div className={`flashcard-page-content ${isZoomed ? 'zoomed' : ''}`}>
                        <h1>{flashcardTitle}</h1>
                        <div className="rating">
                            <h4>Đánh giá học phần này: </h4>
                            {[1, 2, 3, 4, 5].map((value, index) => (
                                <Star
                                    key={value}
                                    onMouseEnter={() => handleStarHover(index)}
                                    onMouseLeave={() => handleStarHover(-1)}
                                    onClick={() => handleStarClick(value)}
                                    className={index <= (hoveredStarIndex !== -1 ? hoveredStarIndex : rating - 1) ? 'filled' : ''}
                                />
                            ))}
                            <button className='rating-button'
                            // onClick={handleSubmitRating}
                            >Gửi Đánh Giá</button>
                            {/* <p>Số điểm trung bình: {averageRating}</p> */}
                        </div>
                        <div className="flashcard-navigation">
                            <NavLink to={`/flashcard${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><ContentCopy color="primary"></ContentCopy> <span>Flashcards</span></NavLink>
                            <NavLink to={`/learn${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}><AutoMode color="primary"></AutoMode> <span>Learn</span></NavLink>
                            <NavLink to={`/test${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}><Quiz color="primary"></Quiz> <span>Test</span></NavLink>
                            <NavLink to={`/match${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0.5rem' }}><Compare color="primary"></Compare> <span>Match</span></NavLink>
                        </div>
                        <div className={`flashcard-form`}>
                            <div className={`flashcard  ${isFlipped ? 'flipped' : ''}`} style={{ animation: shouldAnimate ? `${slideDirection === 'left' ? 'slideLeft' : 'slideRight'} 0.3s ease` : 'none' }} onClick={handleFlipCard}>
                                {flashcards.length > 0 ? (
                                    <React.Fragment>
                                        <div className={isFront ? "front" : "back"}>
                                            {isShuffled ? shuffledFlashcards[currentCardIndex][isFront ? "front_text" : "back_text"] : flashcards[currentCardIndex][isFront ? "front_text" : "back_text"]}
                                        </div>
                                        <div className={!isFront ? "front" : "back"}>
                                            {isShuffled ? shuffledFlashcards[currentCardIndex][!isFront ? "front_text" : "back_text"] : flashcards[currentCardIndex][!isFront ? "front_text" : "back_text"]}
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                            <div className='function-button'>
                                <Shuffle onClick={handleShuffle}>Shuffle {isShuffled ? 'Off' : 'On'}</Shuffle>
                                <ArrowBackIos className='slider-button' onClick={handlePrevCard} disabled={currentCardIndex === 0}>Previous</ArrowBackIos>
                                <span>{`${currentCardIndex + 1}/${flashcards.length}`}</span>
                                <ArrowForwardIos className='slider-button' onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1}>Next</ArrowForwardIos>
                                <CropFreeTwoTone onClick={handleZoom}>Zoom</CropFreeTwoTone>
                            </div>
                        </div>
                    </div>
                    <div className="creator">
                        <img src={creator.avatar} alt="Creator Avatar" />
                        <p>{creator.name}</p>
                    </div>
                    <div className="flashcard-list">
                        <ul>
                            {flashcards.map((card, index) => (
                                <li key={index}>
                                    <strong>{card.front_text}</strong>   <span>{card.back_text}</span>
                                    <button onClick={() => handleDeleteConfirmation(card.card_id)}>Xóa</button>
                                </li>
                            ))}
                            <li>
                                <input
                                    type="text"
                                    placeholder="Thuật ngữ"
                                    value={newCardData.front_text}
                                    onChange={(e) => setNewCardData({ ...newCardData, front_text: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Định nghĩa"
                                    value={newCardData.back_text}
                                    onChange={(e) => setNewCardData({ ...newCardData, back_text: e.target.value })}
                                />
                                <button onClick={handleAddCard}>Thêm thẻ</button>
                            </li>
                        </ul>
                    </div>
                </div>
                {showConfirmation && (
                    <div>
                        <div className="overlay"></div>
                        <div className="confirmation-box">
                            <div className="message">Bạn có chắc chắn muốn xóa thẻ này không?</div>
                            <div className="button-container">
                                <button onClick={handleConfirmDelete}>Xác nhận</button>
                                <button onClick={handleCancelDelete}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Flashcard;
