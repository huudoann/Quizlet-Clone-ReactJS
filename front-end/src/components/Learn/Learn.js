import React, { useState, useEffect, useRef } from 'react';
import './Learn.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from '../Learn/DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';

const Learn = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [formHeight, setFormHeight] = useState('70vh');
  const [showNextMessage, setShowNextMessage] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [disableKeyPress, setDisableKeyPress] = useState(false);
  const [donKnowPressed, setDonKnowPressed] = useState(false);
  const [numCorrect, setNumCorrect] = useState(0);
  const navigate = useNavigate();
  const refInput = useRef(null);
  const set_id = localStorage.getItem('set_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flashcardsData = await Request.Server.get(endPoint.getAllCardsInSet(set_id));
        const data = flashcardsData.content;
        if (data && data.length > 0) {
          const shuffledFlashcards = shuffleArray(data).slice(0, 7);
          setFlashcards(shuffledFlashcards);
        }
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    fetchData();
  }, [set_id]);

  useEffect(() => {
    const updateFormHeight = () => {
      const newHeight = document.getElementById('learn-form').scrollHeight + 'px';
      setFormHeight(newHeight);
    };
    updateFormHeight();
  }, [flashcards, currentIndex, isCorrect]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !disableKeyPress && isCorrect !== null && document.activeElement.tagName !== 'INPUT' && userInput.trim()) {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setUserInput('');
        setIsCorrect(null);
        setInputDisabled(false);
        setFormHeight('70vh');
        setShowNextMessage(false);
        setDisableKeyPress(true);
        setDonKnowPressed(false);
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [disableKeyPress, isCorrect, userInput]);

  const handleSkip = () => {
    setUserInput(' ');
    setDisableKeyPress(false);
    handleSubmit();
    setDonKnowPressed(true);
  };

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

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    setIsCorrect(null);
    setDisableKeyPress(false);
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    if (userInput.trim().toLowerCase() === flashcards[currentIndex].front_text.trim().toLowerCase()) {
      setIsCorrect(true);
      setNumCorrect(prevNumCorrect => prevNumCorrect + 1);
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
        setUserInput('');
        setIsCorrect(null);
        setInputDisabled(false);
        setFormHeight('70vh');
        setShowNextMessage(false);
        refInput.current.focus();
      }, 2000);
    } else {
      setIsCorrect(false);
      setInputDisabled(true);
      setFormHeight('85vh');
      setShowNextMessage(true);
    }
  };

  const handleShowHint = () => {
    setHintShown(true);
  };


  return (
    <div className="learn-page">
      <div className="navigation">
        <DropDownMenu />
        <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
      </div>

      <div className="learn-form" style={{ height: formHeight }} id="learn-form">
        {currentIndex < flashcards.length && (
          <>
            <div className='defi-box'>
              <p>Definition:</p>
              <span>{flashcards[currentIndex].back_text}</span>
              {hintShown ? (
                <p className="hint-text">{flashcards[currentIndex].front_text.charAt(0) + flashcards[currentIndex].front_text.slice(1).replace(/[a-zA-Z]/g, '_')}</p>
              ) : (
                <button className="hint-button" onClick={handleShowHint}>Show hint</button>
              )}
            </div>
            <div className='input-box'>
              <p>Your answer:</p>
              <input
                type="text"
                value={userInput}
                placeholder='Type the answer'
                onChange={handleInputChange}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                disabled={inputDisabled}
                ref={refInput}
              />
              {isCorrect === false && (
                <div className="incorrect-message">
                  <p>Try next time!</p>
                </div>
              )}

              {isCorrect === true && (
                <div className="correct-message">
                  <p>Amazing!</p>
                </div>
              )}
              {isCorrect === false && (
                <div className="answer-box">
                  <p>Câu trả lời đúng:</p>
                  <input
                    type="text"
                    value={flashcards[currentIndex].front_text}
                    readOnly
                    disabled={inputDisabled}
                  />
                </div>
              )}
              <div className='control-button'>
                <button className='btn1' onClick={handleSkip}>Don't know?</button>
                <button
                  className={!userInput.trim() ? 'answer-button disabled' : 'answer-button'}
                  disabled={!userInput.trim()}
                  onClick={handleSubmit}
                >
                  Answer
                </button>
              </div>
            </div>
          </>
        )}
        {showNextMessage && (
          <div className="next-message">
            <p>Nhấn Enter để chuyển sang câu kế tiếp!</p>
          </div>
        )}
        {!flashcards[currentIndex] && (
          <div className="summary">
            <p>Bạn đã hoàn thành lần học này!</p>
            <p>Số câu trả lời đúng: {numCorrect} / {flashcards.length}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learn;
