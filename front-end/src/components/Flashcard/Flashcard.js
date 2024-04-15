import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.scss';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Star, ArrowBackIos, ArrowForwardIos, Shuffle, CropFreeTwoTone, ContentCopy, AutoMode, Quiz, Compare, MoreHoriz, AddCircleOutline, Delete } from '@mui/icons-material';
import Header from '../Header/Header';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
    const [averageRating, setAverageRating] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [cardIdToDelete, setCardIdToDelete] = useState(null);
    const [setIdToDelete, setSetIdToDelete] = useState(null);
    const [newCardData, setNewCardData] = useState({
        front_text: '',
        back_text: ''
    });

    const flashcardContainerRef = useRef(null);
    const set_id = new URLSearchParams(location.search).get('set_id');

    const shuffleArray = (array) => {
        if (!Array.isArray(array)) {
            return array;
        }

        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const newSearchParams = new URLSearchParams(location.search);
                const set_id = newSearchParams.get('set_id');

                if (!set_id) {
                    console.error('Không tìm thấy set_id trong URL');
                    return;
                }
                const flashcardsData = await getCardsDataFromSet(set_id);
                const flashcardsArray = Object.values(flashcardsData.content);
                setFlashcards(flashcardsArray);
                const title = localStorage.getItem('flashcardTitle');
                setFlashcardTitle(title);
            } catch (error) {
                console.error('Error fetching flashcards:', error);
            }
        };

        fetchData();
    }, [location.search]);

    useEffect(() => {
        setShuffledFlashcards(shuffleArray(flashcards));
    }, [flashcards]);

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
                const flashcardsData = await getCardsDataFromSet(set_id); // Lấy lại dữ liệu thẻ sau khi thêm
                setFlashcards(flashcardsData);
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

    // Gọi API gửi đánh giá
    const handleSubmitRating = async () => {
        try {
            let token = localStorage.getItem('token');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                window.location.href("/login");
                return null;
                // throw new Error('Token không tồn tại trong localStorage');
            }
            // Gửi số điểm đánh giá đến API
            const set_id = new URLSearchParams(location.search).get('set_id');
            const point = rating;
            console.log(point);
            const userId = localStorage.getItem('user_id');
            const userRating = {
                user_id: userId,
                set_id: set_id,
                total_stars: point,
            }
            const response = await axios.post(`http://localhost:8080/api/review/sets/${set_id}/review`, userRating, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Đã gửi đánh giá thành công');
            } else {
                console.error('Lỗi khi gửi đánh giá:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request đánh giá:', error.message);
        }
    };

    const fetchReviewing = async () => {
        try {
            let token = localStorage.getItem('token');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                window.location.href("/login");
                return null;
            }

            const set_id = new URLSearchParams(location.search).get('set_id');
            const response = await axios.get(`http://localhost:8080/api/review/sets/${set_id}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const reviewingData = response.data;
                setAverageRating(reviewingData);
            } else {
                console.error('Lỗi khi lay du lieu đánh giá:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request lay du lieu đánh giá:', error.message);
        }
    };

    const handleDeleteSet = async () => {
        setShowConfirmation(true);
        setSetIdToDelete(set_id);
    };

    const handleConfirmDeleteSet = async () => {
        setShowConfirmation(false);
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                window.location.href("/login")
                return null
            }
            const response = await axios.delete(`http://localhost:8080/api/set/${setIdToDelete}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Set đã được xóa thành công');
                navigate('/sets');
            } else {
                console.error('Lỗi khi xóa set:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi gửi request xóa set:', error.message);
        }
    };

    useEffect(() => {
        fetchReviewing();
    }, [location.search], [flashcards]);

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
        if (flashcards.length > 0) {
            setShuffledFlashcards(shuffleArray(flashcards));
        }
    }, [flashcards]);

    const shuffleRemainingCards = () => {
        if (flashcards.length > 0) {
            const remainingCards = isShuffled ? shuffledFlashcards.slice(currentCardIndex) : flashcards.slice(currentCardIndex);
            const shuffledRemainingCards = shuffleArray(remainingCards);
            const newFlashcards = [...flashcards.slice(0, currentCardIndex), ...shuffledRemainingCards];
            setShuffledFlashcards(newFlashcards);
        }
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

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
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
                            <p>({averageRating})</p>
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
                                onClick={handleSubmitRating}
                            >Gửi Đánh Giá</button>

                        </div>
                        <div className="flashcard-navigation">
                            <NavLink to={`/flashcard${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}><ContentCopy color="primary"></ContentCopy> <span>Flashcards</span></NavLink>
                            <NavLink to={`/learn${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}><AutoMode color="primary"></AutoMode> <span>Learn</span></NavLink>
                            <NavLink to={`/test${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}><Quiz color="primary"></Quiz> <span>Test</span></NavLink>
                            <NavLink to={`/match${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0.5rem' }}><Compare color="primary"></Compare> <span>Match</span></NavLink>
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
                        <Link to="/edit-set" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <symbol id="edit" viewBox="0 0 24 24">
                                    <path d="M3.43865 17.9013C3.47528 17.7269 3.56185 17.567 3.68781 17.4411L15.5903 5.53862L18.4614 8.40973L6.55892 20.3122C6.43296 20.4381 6.27307 20.5247 6.09874 20.5613L4.10683 20.9798C3.45856 21.116 2.88398 20.5414 3.02017 19.8932L3.43865 17.9013Z"></path>
                                    <path d="M17.5914 3.53752L16.6899 4.43901L19.561 7.31013L20.4625 6.40863C21.1792 5.69194 21.1792 4.52995 20.4625 3.81326L20.1867 3.53752C19.4701 2.82083 18.3081 2.82083 17.5914 3.53752Z"></path>
                                </symbol>
                            </svg>
                            <svg className="AssemblyIcon AssemblyIcon--medium" role="presentation">
                                <use xlinkHref="#edit" />
                            </svg>
                        </Link>
                        <div className="menu-container">
                            <button onClick={toggleMenu}><MoreHoriz /></button>
                            {showMenu && (
                                <div className="menu">
                                    <button onClick={() => console.log("Add to Folder")}><AddCircleOutline />Add to Folder</button>
                                    <button onClick={() => handleDeleteSet(set_id)}><Delete />Delete Set</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flashcard-list">
                        <ul>
                            {flashcards && flashcards.length > 0 ? (
                                flashcards.map((card, index) => (
                                    <li key={index}>
                                        <strong>{card.front_text}</strong>   <span>{card.back_text}</span>
                                        <button onClick={() => handleDeleteConfirmation(card.card_id)}>Xóa</button>
                                    </li>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
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
                            <div className="message">Bạn có chắc chắn muốn xóa không?</div>
                            <div className="button-container">
                                <button onClick={handleConfirmDelete}>Xác nhận</button>
                                <button onClick={handleCancelDelete}>Hủy bỏ</button>
                            </div>
                        </div>
                    </div>
                )}

                {showConfirmation && (
                    <div>
                        <div className="overlay"></div>
                        <div className="confirmation-box">
                            <div className="message">Bạn có chắc chắn muốn xóa không?</div>
                            <div className="button-container">
                                <button onClick={handleConfirmDeleteSet}>Xác nhận</button>
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