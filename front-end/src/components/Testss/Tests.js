import React, { useState, useEffect } from 'react';
import './Tests.scss';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Backdrop } from '@mui/material';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';

const Tests = () => {
    const [elapsedTime, setElapsedTime] = useState(1200);
    const [flashcards, setFlashcards] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Biến đếm số lượng câu trả lời đúng
    const [submitted, setSubmitted] = useState(false); // Kiểm tra xem người dùng đã nộp bài thi chưa
    const [totalQuestions, setTotalQuestions] = useState(0); // Lưu tổng số câu hỏi
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [showResults, setShowResults] = useState(false); // Hiển thị kết quả hay không
    const [timerRunning, setTimerRunning] = useState(true); // Kiểm tra thời gian đếm ngược có đang chạy hay không
    const navigate = useNavigate();
    const set_id = localStorage.getItem('set_id');

    useEffect(() => {
        // useEffect cho bộ đếm ngược thời gian
        const timerId = setInterval(() => {
            setElapsedTime(prevTime => {
                if (prevTime > 0 && timerRunning) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerId);
                    setOpenDialog(true);
                    return 0;
                }
            });
        }, 1000); // Mỗi giây

        return () => {
            clearInterval(timerId);
        };
    }, [timerRunning]);

    //format thời gian
    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flashcardsData = await Request.Server.get(endPoint.getAllCardsInSet(set_id));
                const data = flashcardsData.content;
                if (data && data.length > 0) {
                    const shuffledFlashcards = shuffleArray(data).slice(0, 20);
                    setFlashcards(shuffledFlashcards);
                    console.log("Lấy flashcards thành công", data);
                }
            } catch (error) {
                console.error('Lỗi lấy flashcards:', error);
            }
        };

        fetchData();

    }, [set_id]);

    useEffect(() => {
        // useEffect sinh câu hỏi và đáp án
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
        navigate(`/flashcard`);
    };

    const generateAnswers = (flashcard, index) => {
        const correctAnswerIndex = Math.floor(Math.random() * 4);
        const correctAnswer = flashcard.front_text;
        const randomAnswers = flashcards.map(flashcard => flashcard.front_text).filter(text => text !== correctAnswer);
        const shuffledAnswers = shuffleArray(randomAnswers);
        // Add fake answers if needed to ensure there are at least 4 answers
        const fakeAnswersCount = 4 - shuffledAnswers.length;
        for (let i = 0; i < fakeAnswersCount; i++) {
            shuffledAnswers.push(`Fake Answer ${i + 1}`);
        }
        shuffledAnswers.splice(correctAnswerIndex, 0, correctAnswer);
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers.splice(index * 4, 4, ...shuffledAnswers);
            return updatedAnswers;
        });
    };

    const handleAnswerSelection = (index, answerIndex) => {
        // Nếu đã hiển thị kết quả, không cho phép chọn đáp án
        if (showResults) return;

        const selectedAnswerIndex = index * 4 + answerIndex;

        // Cập nhật đáp án người dùng đã chọn
        setSelectedAnswers(prevState => {
            const updatedState = { ...prevState };
            updatedState[index] = selectedAnswerIndex;
            return updatedState;
        });

        const selectedAnswer = flashcards[index].front_text; // Lấy câu trả lời được chọn
        const correctAnswer = answers[selectedAnswerIndex]; // Lấy đáp án được chọn từ mảng answers
        if (selectedAnswer === correctAnswer) {
            setCorrectAnswersCount(prevCount => prevCount + 1); // Tăng số câu trả lời đúng lên 1 nếu đúng
        }
    };

    const handleSubmitButtonClick = () => {
        setConfirmDialogOpen(true);
        setTimerRunning(false); // Dừng thời gian đếm ngược
        setSubmitted(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        // Khi đóng dialog kết quả, hiển thị kết quả
        setShowResults(true);
    };

    const handleConfirmDialogClose = (confirmed) => {
        if (confirmed) {
            // Nếu người dùng xác nhận nộp bài, thì hiển thị dialog kết quả
            setOpenDialog(true);
            setSubmitted(true);
            const totalQuestionsCount = flashcards.length;
            setTotalQuestions(totalQuestionsCount);

            // Tính số câu trả lời đúng sau khi người dùng xác nhận nộp bài
            let correctCount = 0;
            // Lặp qua các thuộc tính của object selectedAnswers
            Object.keys(selectedAnswers).forEach((index) => {
                const selectedAnswerIndex = selectedAnswers[index];
                const selectedAnswer = answers[selectedAnswerIndex];
                const correctAnswer = flashcards[index].front_text;
                if (selectedAnswer === correctAnswer) {
                    correctCount++;
                }
            });
            setCorrectAnswersCount(correctCount);

            setConfirmDialogOpen(false);
        } else {
            setConfirmDialogOpen(false);
        }
    };

    return (
        <div className="Tests">
            <div className="navigation">
                <DropDownMenu />
                <div className="elapsed-time">
                    <p>Thời gian còn lại: {formatTime(elapsedTime)}</p>
                </div>
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>

            {flashcards.map((flashcard, index) => (
                <div className="tests-form" key={index}>
                    <div className='defi-box'>
                        {showResults ? (
                            <div className="answer-icon">
                                {selectedAnswers[index] ? (
                                    <p>Câu {index + 1}:</p>
                                ) : (
                                    <p>Câu {index + 1}:</p>
                                )}
                            </div>
                        ) : (
                            <p>Câu {index + 1}:</p>
                        )}
                        <p>Definition</p>
                        <p className="back-text">{flashcard.back_text}</p>
                    </div>
                    <div className='term-box'>
                        <p className='select-term'>Chọn thuật ngữ đúng</p>
                        <div className="buttons-answer">
                            <div className="button-row">
                                {answers.slice(index * 4, index * 4 + 4).map((answer, answerIndex) => (
                                    <button
                                        key={answerIndex}
                                        className={`${showResults && answer === flashcard.front_text ? 'correct' : ''
                                            } ${showResults && selectedAnswers[index] === index * 4 + answerIndex && answer !== flashcard.front_text
                                                ? 'incorrect'
                                                : ''
                                            } ${selectedAnswers[index] === index * 4 + answerIndex && !showResults ? 'clicked' : ''
                                            }`}
                                        onClick={() => handleAnswerSelection(index, answerIndex)}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dialog xác nhận khi nộp bài */}
            <Dialog open={confirmDialogOpen} onClose={() => handleConfirmDialogClose(false)}>
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc chắn muốn nộp bài không?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirmDialogClose(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={() => handleConfirmDialogClose(true)} color="primary">
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog kết quả bài kiểm tra */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Kết quả bài kiểm tra</DialogTitle>
                <DialogContent>
                    <div className="results">
                        <p>Số câu trả lời đúng: {correctAnswersCount} / {totalQuestions}</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Mờ nền */}
            <Backdrop open={confirmDialogOpen || openDialog} />

            {/* Button "Gửi bài kiểm tra" */}
            {!submitted && (
                <Button variant="contained"
                    onClick={handleSubmitButtonClick}
                    className="submit-button"
                    style={{ marginBottom: '1rem' }}>
                    Nộp bài
                </Button>
            )}
        </div>
    );
}

export default Tests;
