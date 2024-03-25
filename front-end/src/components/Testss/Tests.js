import React, { useState, useEffect } from 'react';
import './Tests.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const Tests = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            return;
        }

        const fetchData = async () => {
            try {
                const set_id = new URLSearchParams(location.search).get('set_id');
                const flashcardsData = await getCardsDataFromSet(set_id);
                const data = flashcardsData.content;
                if (data && data.length > 0) {
                    const shuffledFlashcards = shuffleArray(data).slice(0, 20);
                    setFlashcards(shuffledFlashcards);
                    console.log("Lấy dữ liệu thành công", data);
                }
            } catch (error) {
                console.error('Lỗi lấy cards:', error);
            }
        };

        fetchData();

    }, [location.search, mounted]);

    useEffect(() => {
        if (flashcards.length > 0) {
            flashcards.forEach((flashcard, index) => {
                generateAnswers(flashcard, index);
            });
        }
    }, [flashcards]);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleCloseButtonClick = () => {
        navigate(`/flashcard${location.search}`);
    };

    const generateAnswers = (flashcard, index) => {
        const correctAnswerIndex = Math.floor(Math.random() * 4);
        const correctAnswer = flashcard.front_text;
        const randomAnswers = flashcards.map(flashcard => flashcard.front_text).filter(text => text !== correctAnswer);
        const shuffledAnswers = shuffleArray(randomAnswers).slice(0, 3);
        shuffledAnswers.splice(correctAnswerIndex, 0, correctAnswer);
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers.splice(index * 4, 4, ...shuffledAnswers);
            return updatedAnswers;
        });
    };

    return (
        <div className="Tests">
            <div className="navigation">
                <DropDownMenu />
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>

            {flashcards.map((flashcard, index) => (
                <div className="tests-form" key={index}>
                    <div className='defi-box'>
                        <p>Definition</p>
                        <p className="back-text">{flashcard.back_text}</p>
                    </div>
                    <div className='term-box'>
                        <p className='select-term'>Chọn thuật ngữ đúng</p>
                        <div className="buttons-answer">
                            <div className="button-row">
                                {answers.slice(index * 4, index * 4 + 2).map((answer, answerIndex) => (
                                    <button key={answerIndex}>{answer}</button>
                                ))}
                            </div>
                            <div className="button-row">
                                {answers.slice(index * 4 + 2, index * 4 + 4).map((answer, answerIndex) => (
                                    <button key={answerIndex + 2}>{answer}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Tests;
