import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.scss';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Star, ArrowBackIos, ArrowForwardIos, Shuffle, CropFreeTwoTone, ContentCopy, AutoMode, Quiz, Compare, MoreHoriz, AddCircleOutline, Delete } from '@mui/icons-material';
import Header from '../Header/Header';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import IconSprite from '../Icon/IconSprite';
import { Button, ButtonGroup } from '@mui/material';

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
    const set_id = localStorage.getItem('set_id');
    const [newCardData, setNewCardData] = useState({
        front_text: '',
        back_text: '',
        is_known: false,
        updated_at: new Date(),
    });

    const flashcardContainerRef = useRef(null);

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

    //gọi API lấy tất cả thẻ theo set_id
    useEffect(() => {
        const fetchData = async () => {
            try {
                const set_id = localStorage.getItem('set_id');

                if (!set_id) {
                    console.error('Không tìm thấy set_id trong URL');
                    return;
                }
                const flashcardsData = await getCardsDataFromSet(set_id);
                const flashcardsArray = Object.values(flashcardsData.content);
                setFlashcards(flashcardsArray);
                const title = localStorage.getItem('flashcardTitle');
                setFlashcardTitle(title);
                console.log(localStorage);
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
            const set_id = localStorage.getItem('set_id');
            const createCardApiUrl = `http://localhost:8080/api/card/${set_id}/create_card`
            const response = await axios.post(createCardApiUrl, newCardData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                //Thực hiện các thao tác cập nhật giao diện sau khi thêm thẻ thành công
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
            const response = await axios.delete(`http://localhost:8080/api/card/${cardIdToDelete}`, {
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
            const set_id = localStorage.getItem('set_id');
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

    //gọi API lấy review
    const fetchReviewing = async () => {
        try {
            let token = localStorage.getItem('token');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                window.location.href("/login");
                return null;
            }

            const set_id = localStorage.getItem('set_id');
            const response = await axios.get(`http://localhost:8080/api/review/sets/${set_id}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("lay rv tc");
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

    //gọi API xóa set
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

    //Ẩn/hiện dialog
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
                            <NavLink to={`/flashcard${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem' }}>
                                <IconSprite>
                                    <symbol id="study-flashcards-twilight" viewBox="0 0 32 32">
                                        <path d="M7.72705 12.8246C7.72705 11.2646 8.97351 10 10.5111 10H27.2157C28.7533 10 29.9998 11.2646 29.9998 12.8246V25.1754C29.9998 26.7354 28.7533 28 27.2157 28H10.5111C8.97351 28 7.72705 26.7354 7.72705 25.1754V12.8246Z" fill="#7583FF"></path>
                                        <path d="M2 6.82456C2 5.2646 3.25358 4 4.79996 4H21.6001C23.1465 4 24.4001 5.2646 24.4001 6.82456V19.1754C24.4001 20.7354 23.1465 22 21.6001 22H4.79996C3.25358 22 2 20.7354 2 19.1754V6.82456Z" fill="#4255FF"></path>
                                    </symbol>
                                </IconSprite>
                                <Icon name="study-flashcards-twilight" className="AssemblyIcon AssemblyIcon--larger" />
                                <span>Flashcards</span></NavLink>
                            <NavLink to={`/learn${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}>
                                <IconSprite>
                                    <symbol id="study-learn-twilight" viewBox="0 0 32 32">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.4382 3.59133C12.0988 1.86065 9.53452 1.48966 7.70851 2.73508C6.35638 3.6573 5.76474 5.22246 6.08552 6.68675C1.72912 10.8021 0.637202 17.3182 3.87885 22.5891C7.08103 27.7957 13.5062 30.1541 19.4026 28.7697C20.8007 30.185 23.1247 30.4186 24.8161 29.265C26.6593 28.0079 27.0851 25.5576 25.7315 23.8085C24.392 22.0779 21.8278 21.7069 20.0018 22.9523C19.0335 23.6127 18.4543 24.6034 18.3224 25.6523C13.907 26.5767 9.18612 24.7646 6.82903 20.932C4.48648 17.1231 5.16237 12.4327 8.17514 9.32516C9.51726 10.0007 11.2072 9.9451 12.5229 9.04779C14.366 7.79065 14.7919 5.34035 13.4382 3.59133ZM9.81309 5.54667C10.046 5.3878 10.3727 5.44596 10.5268 5.64501C10.6666 5.82565 10.6339 6.0891 10.4181 6.2363C10.1855 6.39498 9.85872 6.33693 9.70463 6.13783C9.56476 5.95711 9.59755 5.69368 9.81309 5.54667ZM22.1063 25.7638C22.3392 25.605 22.6659 25.6631 22.82 25.8622C22.9598 26.0428 22.9271 26.3063 22.7113 26.4535C22.4786 26.6122 22.1519 26.5541 21.9978 26.355C21.8579 26.1743 21.8907 25.9108 22.1063 25.7638Z" fill="#4255FF"></path>
                                        <path d="M17.2456 2.79324C16.3598 2.72817 15.5491 3.35107 15.4755 4.23308C15.4018 5.11817 16.1038 5.8559 16.9918 5.92113C17.5634 5.96313 18.131 6.04807 18.6884 6.17492C19.5523 6.37149 20.452 5.8782 20.6726 5.02379C20.8954 4.16068 20.3257 3.3218 19.4554 3.12375C18.7293 2.95855 17.9902 2.84794 17.2456 2.79324Z" fill="#7583FF"></path>
                                        <path d="M24.8609 5.60115C24.1548 5.07419 23.1287 5.17961 22.5601 5.85098C21.9804 6.53556 22.1073 7.53317 22.8262 8.06973C23.2723 8.40269 23.6892 8.76922 24.0731 9.16672C24.6844 9.7997 25.7151 9.84511 26.3856 9.27441C27.0689 8.69284 27.1237 7.68906 26.5003 7.04362C25.995 6.52042 25.4468 6.03845 24.8609 5.60115Z" fill="#7583FF"></path>
                                        <path d="M29.4953 11.9758C29.2195 11.1384 28.2915 10.698 27.4414 10.9447C26.5834 11.1937 26.0704 12.0666 26.3496 12.9144C26.5179 13.4255 26.6411 13.9473 26.7188 14.4752C26.8475 15.3498 27.6939 15.9259 28.5739 15.8117C29.4577 15.6971 30.113 14.9197 29.9835 14.0398C29.8808 13.3416 29.7178 12.6516 29.4953 11.9758Z" fill="#7583FF"></path>
                                        <path d="M28.4072 17.69C27.5557 17.4484 26.6304 17.8942 26.3601 18.7335C26.1951 19.246 25.9867 19.7457 25.7369 20.2271C25.3247 21.0216 25.6866 21.9633 26.5008 22.3356C27.304 22.7029 28.2874 22.3978 28.6927 21.6164C29.021 20.9837 29.295 20.3269 29.512 19.6529C29.7856 18.8034 29.2667 17.9339 28.4072 17.69Z" fill="#7583FF"></path>
                                    </symbol>
                                </IconSprite>
                                <Icon name="study-learn-twilight" className="AssemblyIcon AssemblyIcon--larger" />
                                <span>Learn</span></NavLink>
                            <NavLink to={`/test${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginRight: '0.5rem', marginLeft: '0.5rem' }}>
                                <IconSprite>
                                    <symbol fill="none" id="study-test-twilight" viewBox="0 0 32 32" class="__web-inspector-hide-shortcut__">
                                        <path d="M8.67554 6.37019C8.67554 5.06107 9.78985 3.99982 11.1644 3.99982H19.6433C20.3216 3.99982 20.9706 4.2635 21.44 4.72987L26.65 9.90607C27.0942 10.3474 27.3422 10.9351 27.3422 11.5464V22.9628C27.3422 24.2719 26.2279 25.3332 24.8533 25.3332H11.1644C9.78985 25.3332 8.67554 24.2719 8.67554 22.9628V6.37019Z" fill="#7583FF"></path>
                                        <path d="M4.72437 9.04041C4.72437 7.73129 5.83868 6.67004 7.21325 6.67004H15.6921C16.3705 6.67004 17.0194 6.93373 17.4888 7.4001L22.6988 12.5763C23.143 13.0176 23.391 13.6053 23.391 14.2166V25.633C23.391 26.9421 22.2767 28.0034 20.9021 28.0034H7.21325C5.83868 28.0034 4.72437 26.9421 4.72437 25.633V9.04041Z" fill="#4255FF"></path>
                                        <rect x="7.21289" y="16.1515" width="9.95556" height="2.37037" rx="1.18519" fill="white"></rect>
                                        <rect x="7.21289" y="20.8923" width="7.46667" height="2.37037" rx="1.18519" fill="white"></rect>
                                    </symbol>
                                </IconSprite>
                                <Icon name="study-test-twilight" className="AssemblyIcon AssemblyIcon--larger" />
                                <span>Test</span></NavLink>
                            <NavLink to={`/match${location.search}`} activeclassname="active" style={{ textDecoration: 'none', color: 'inherit', marginLeft: '0.5rem' }}>
                                <IconSprite>
                                    <symbol fill="none" id="study-match-twilight" viewBox="0 0 32 32">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.66664 4C3.19388 4 1.99997 5.26414 1.99997 6.82353V15.2941C1.99997 16.8535 3.19388 18.1177 4.66664 18.1177H23.3333C24.8061 18.1177 26 16.8535 26 15.2941V6.82353C26 5.26414 24.8061 4 23.3333 4H4.66664ZM8.66659 9.64704C7.93021 9.64704 7.33325 10.2791 7.33325 11.0588C7.33325 11.8385 7.93021 12.4706 8.66659 12.4706H19.3333C20.0696 12.4706 20.6666 11.8385 20.6666 11.0588C20.6666 10.2791 20.0696 9.64704 19.3333 9.64704H8.66659Z" fill="#4255FF"></path>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.6666 15.2939C15.1938 15.2939 13.9999 16.5581 13.9999 18.1175V25.1763C13.9999 26.7357 15.1938 27.9998 16.6666 27.9998H27.3332C28.806 27.9998 29.9999 26.7357 29.9999 25.1763V18.1175C29.9999 16.5581 28.806 15.2939 27.3332 15.2939H16.6666ZM19.3335 20.2352C18.5971 20.2352 18.0001 20.8672 18.0001 21.6469C18.0001 22.4266 18.5971 23.0587 19.3335 23.0587H24.6668C25.4032 23.0587 26.0001 22.4266 26.0001 21.6469C26.0001 20.8672 25.4032 20.2352 24.6668 20.2352H19.3335Z" fill="#7583FF"></path>
                                    </symbol>
                                </IconSprite>
                                <Icon name="study-match-twilight" className="AssemblyIcon AssemblyIcon--larger" />
                                <span>Match</span></NavLink>
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
                                <Button onClick={handleShuffle} style={{ position: 'absolute', left: '0' }}>
                                    <IconSprite >
                                        <symbol id="shuffle" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.1371 8.81625L4.97691 3.7875C4.5267 3.34875 3.79942 3.34875 3.34921 3.7875C2.89899 4.22625 2.89899 4.935 3.34921 5.37375L8.49784 10.3912L10.1371 8.81625ZM15.632 3.95625L17.0058 5.295L3.33766 18.615C2.88745 19.0537 2.88745 19.7625 3.33766 20.2013C3.78788 20.64 4.51515 20.64 4.96537 20.2013L18.645 6.8925L20.0188 8.23125C20.3766 8.58 21 8.3325 21 7.82625V3.5625C21 3.2475 20.746 3 20.4228 3H16.0476C15.5281 3 15.2742 3.6075 15.632 3.95625ZM15.0317 13.5863L13.404 15.1725L17.0173 18.6937L15.632 20.0437C15.2742 20.3925 15.5281 21 16.0476 21H20.4228C20.746 21 21 20.7525 21 20.4375V16.1737C21 15.6675 20.3766 15.42 20.0188 15.78L18.645 17.1188L15.0317 13.5863Z"></path>
                                        </symbol>
                                    </IconSprite>
                                    <Icon name="shuffle" className="AssemblyIcon AssemblyIcon--larger" />
                                    {/* Shuffle */}
                                    {/* {isShuffled ? 'Off' : 'On'} */}
                                </Button>

                                <Button className='slider-button' onClick={handlePrevCard} disabled={currentCardIndex === 0}>
                                    <IconSprite >
                                        <symbol id="arrow-left" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9961 11.0076L6.99614 11.0076L12.5627 5.10988C13.0638 4.49442 13.1469 3.81523 12.6791 3.33739C12.2268 2.87542 11.4963 2.89791 11.044 3.35988L3.33994 11.1802C2.88766 11.6422 2.88766 12.3884 3.33994 12.8504L11.0324 20.6539C11.4847 21.1159 12.2077 21.1111 12.69 20.6803C13.188 20.2354 13.0048 19.4402 12.5667 18.9341L6.99614 13.0084H19.9961C20.634 13.0084 20.9961 12.652 20.9961 12.0005C20.9961 11.349 20.634 11.0076 19.9961 11.0076Z"></path>
                                        </symbol>                                        </IconSprite>
                                    <Icon name="arrow-left" className="AssemblyIcon AssemblyIcon--larger" />
                                </Button>

                                <span>{`${currentCardIndex + 1}/${flashcards.length}`}</span>

                                <Button className='slider-button' onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1}>
                                    <IconSprite >
                                        <symbol id="arrow-right" viewBox="0 0 24 24">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.00098 12.9963H17.001L11.4344 18.894C10.9333 19.5095 10.8502 20.1887 11.318 20.6665C11.7703 21.1285 12.5009 21.106 12.9531 20.644L20.6572 12.8237C21.1095 12.3618 21.1095 11.6155 20.6572 11.1536L12.9647 3.34999C12.5125 2.88802 11.7894 2.89278 11.3071 3.32361C10.8091 3.76851 10.9923 4.56372 11.4305 5.06982L17.001 10.9955L4.00098 10.9955C3.36316 10.9955 3.00098 11.3519 3.00098 12.0034C3.00098 12.6549 3.36316 12.9963 4.00098 12.9963Z"></path>
                                        </symbol>
                                    </IconSprite>
                                    <Icon name="arrow-right" className="AssemblyIcon AssemblyIcon--larger" />
                                </Button>


                                <Button onClick={handleZoom} style={{ position: 'absolute', right: '0' }}>
                                    <IconSprite >
                                        <symbol id="fullscreen" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.14286 12.2857C2.51429 12.2857 2 12.8 2 13.4286V16.8571C2 17.4857 2.51429 18 3.14286 18H6.57143C7.2 18 7.71429 17.4857 7.71429 16.8571C7.71429 16.2286 7.2 15.7143 6.57143 15.7143H4.28571V13.4286C4.28571 12.8 3.77143 12.2857 3.14286 12.2857ZM3.14286 7.71429C3.77143 7.71429 4.28571 7.2 4.28571 6.57143V4.28571H6.57143C7.2 4.28571 7.71429 3.77143 7.71429 3.14286C7.71429 2.51429 7.2 2 6.57143 2H3.14286C2.51429 2 2 2.51429 2 3.14286V6.57143C2 7.2 2.51429 7.71429 3.14286 7.71429ZM15.7143 15.7143H13.4286C12.8 15.7143 12.2857 16.2286 12.2857 16.8571C12.2857 17.4857 12.8 18 13.4286 18H16.8571C17.4857 18 18 17.4857 18 16.8571V13.4286C18 12.8 17.4857 12.2857 16.8571 12.2857C16.2286 12.2857 15.7143 12.8 15.7143 13.4286V15.7143ZM12.2857 3.14286C12.2857 3.77143 12.8 4.28571 13.4286 4.28571H15.7143V6.57143C15.7143 7.2 16.2286 7.71429 16.8571 7.71429C17.4857 7.71429 18 7.2 18 6.57143V3.14286C18 2.51429 17.4857 2 16.8571 2H13.4286C12.8 2 12.2857 2.51429 12.2857 3.14286Z"></path>
                                        </symbol>
                                    </IconSprite>
                                    <Icon name="fullscreen" className="AssemblyIcon AssemblyIcon--larger" />

                                </Button>


                            </div>
                        </div>
                    </div>
                    <div className="creator">
                        <img src={creator.avatar} alt="Creator Avatar" />
                        <p>{creator.name}</p>

                        <div className="menu-container">
                            <Link to="/edit-set" style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                <IconSprite>
                                    <symbol id="edit" viewBox="0 0 24 24" >
                                        <path d="M3.43865 17.9013C3.47528 17.7269 3.56185 17.567 3.68781 17.4411L15.5903 5.53862L18.4614 8.40973L6.55892 20.3122C6.43296 20.4381 6.27307 20.5247 6.09874 20.5613L4.10683 20.9798C3.45856 21.116 2.88398 20.5414 3.02017 19.8932L3.43865 17.9013Z"></path>
                                        <path d="M17.5914 3.53752L16.6899 4.43901L19.561 7.31013L20.4625 6.40863C21.1792 5.69194 21.1792 4.52995 20.4625 3.81326L20.1867 3.53752C19.4701 2.82083 18.3081 2.82083 17.5914 3.53752Z"></path>
                                    </symbol>
                                </IconSprite>
                                <Icon name="edit" className="AssemblyIcon AssemblyIcon--medium" />
                            </Link>
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
                                        <button onClick={() => handleDeleteConfirmation(card.card_id)}><Delete /></button>
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

            </div>
        </div>
    );
};

export default Flashcard;