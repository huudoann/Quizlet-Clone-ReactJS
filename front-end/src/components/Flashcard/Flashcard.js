import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { Star, ArrowBackIos, ArrowForwardIos, Shuffle, CropFreeTwoTone, ContentCopy, AutoMode, Quiz, Compare } from '@mui/icons-material';
import Header from '../Header/Header';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';

const Flashcard = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isFront, setIsFront] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [slideDirection, setSlideDirection] = useState('left');
    const [rating, setRating] = useState(0);
    const [hoveredStarIndex, setHoveredStarIndex] = useState(-1);
    const [flashcards, setFlashcards] = useState([]);
    const [flashcardTitle, setFlashcardTitle] = useState('');
    const location = useLocation();

    const flashcardContainerRef = useRef(null);

    // gọi API lấy dữ liệu từ BE (đang fake dữ liệu để test)
    useEffect(() => {
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

        fetchData();
    }, [location.search]);


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

    const handleSubmitRating = () => {
        console.log("Đã gửi đánh giá:", rating);
    };

    return (
        <div>
            <Header />
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
                        <button className='rating-button' onClick={handleSubmitRating}>Gửi Đánh Giá</button>
                    </div>
                    <div className="flashcard-navigation">
                        <NavLink to={`/flashcard${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><ContentCopy color="primary"></ContentCopy> <span>Flashcards</span></NavLink>
                        <NavLink to={`/learn${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><AutoMode color="primary"></AutoMode> <span>Learn</span></NavLink>
                        <NavLink to={`/test${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Quiz color="primary"></Quiz> <span>Test</span></NavLink>
                        <NavLink to={`/match${location.search}`} activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Compare color="primary"></Compare> <span>Match</span></NavLink>
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
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
