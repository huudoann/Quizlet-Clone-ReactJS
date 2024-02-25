import React, { useState } from 'react';
import './Flashcard.scss';
import flashcardDemoData from './FlashcardDemo';
import { NavLink } from 'react-router-dom';
import { ArrowBackIos, ArrowForwardIos, Flip, CropFreeTwoTone, Style, LocalLibrary, Quiz, Compare } from '@mui/icons-material';
import Header from '../Header/Header';


//  sửa hover; khi đang ở definition chuyển cảnh thì không bị lật, thêm chuyển cảnh ở đổi thẻ

const Flashcard = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const { subject, flashcards, creator } = flashcardDemoData;

    if (!flashcards || !flashcards.length) {
        return <div className='no-flashcard'>No flashcards available.</div>;
    }

    const handleNextCard = () => {
        if (currentCardIndex < flashcards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleFlipCard = () => {
        setIsFlipped(!isFlipped);
    };

    const handleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <div>

            {<Header />}
            <div className="flashcard-container">
                <div className={`flashcard-page-content ${isZoomed ? 'zoomed' : ''}`}>
                    <h1>{subject}</h1>
                    <div className="flashcard-navigation">
                        <NavLink to="/flashcard" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Style></Style> <span>Flashcards</span></NavLink>
                        <NavLink to="/learn" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><LocalLibrary></LocalLibrary> <span>Learn</span></NavLink>
                        <NavLink to="/test" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Quiz></Quiz> <span>Test</span></NavLink>
                        <NavLink to="/match" activeClassName="active" style={{ textDecoration: 'none', color: 'inherit' }}><Compare></Compare> <span>Match</span></NavLink>
                    </div>
                    <div className={`flashcard-form`}>
                        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlipCard}>
                            <div className="front">{flashcards[currentCardIndex].front_text}</div>
                            <div className="back">{flashcards[currentCardIndex].back_text}</div>
                        </div>
                        <div className='function-button'>
                            <Flip onClick={handleFlipCard}>Flip</Flip>
                            <ArrowBackIos onClick={handlePrevCard} disabled={currentCardIndex === 0}>Previous</ArrowBackIos>
                            <span>{`${currentCardIndex + 1}/${flashcards.length}`}</span>
                            <ArrowForwardIos onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1}>Next</ArrowForwardIos>
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