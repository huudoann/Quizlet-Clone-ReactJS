import React, { useState, useEffect, useRef } from 'react';
import './Flashcard.scss';
import flashcardDemoData from './FlashcardDemo';
import { NavLink } from 'react-router-dom';
import { ArrowBackIos, ArrowForwardIos, Shuffle, CropFreeTwoTone, ContentCopy, AutoMode, Quiz, Compare } from '@mui/icons-material';
import Header from '../Header/Header';

const Flashcard = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [shuffledFlashcards, setShuffledFlashcards] = useState([]);
    const [isShuffled, setIsShuffled] = useState(false);
    const [isFront, setIsFront] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const flashcardContainerRef = useRef(null);

    const { subject, flashcards, creator } = flashcardDemoData;

    useEffect(() => {
        setShuffledFlashcards(shuffleArray(flashcards));
    }, [flashcards]);

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

    const shuffleArray = (array) => {
        const newArray = [...array];

        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const handleNextCard = () => {
        if (currentCardIndex < shuffledFlashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
            setIsFront(true);
            setScrollPosition(flashcardContainerRef.current.scrollLeft + flashcardContainerRef.current.offsetWidth);
            setShouldAnimate(true);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
            setIsFront(true);
            setScrollPosition(flashcardContainerRef.current.scrollLeft - flashcardContainerRef.current.offsetWidth);
            setShouldAnimate(true);
        }
    };

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
            setShuffledFlashcards(flashcards);;
        }
        setIsShuffled(!isShuffled);
    };

    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
        setIsFront(!isFront);
    };

    const handleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div>
            <Header />
            <div className="flashcard-container" ref={flashcardContainerRef}>
                <div className={`flashcard-page-content ${isZoomed ? 'zoomed' : ''}`}>
                    <h1>{subject}</h1>
                    <div className="flashcard-navigation">
                        <NavLink to="/flashcard" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><ContentCopy color="primary"></ContentCopy> <span>Flashcards</span></NavLink>
                        <NavLink to="/learn" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><AutoMode color="primary"></AutoMode> <span>Learn</span></NavLink>
                        <NavLink to="/test" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Quiz color="primary"></Quiz> <span>Test</span></NavLink>
                        <NavLink to="/match" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Compare color="primary"></Compare> <span>Match</span></NavLink>
                    </div>
                    <div className={`flashcard-form`}>
                        <div className={`flashcard  ${isFlipped ? 'flipped' : ''}` } style={{ animation: shouldAnimate ? 'slideLeft 0.5s ease' : 'none'}} onClick={handleFlipCard}>
                            <div className={isFront ? "front" : "back"}>
                                {isShuffled ? shuffledFlashcards[currentCardIndex][isFront ? "front_text" : "back_text"] : flashcards[currentCardIndex][isFront ? "front_text" : "back_text"]}
                            </div>
                            <div className={!isFront ? "front" : "back"}>
                                {isShuffled ? shuffledFlashcards[currentCardIndex][!isFront ? "front_text" : "back_text"] : flashcards[currentCardIndex][!isFront ? "front_text" : "back_text"]}
                            </div>
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
                                <strong>{card.front_text}</strong>   {card.back_text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
