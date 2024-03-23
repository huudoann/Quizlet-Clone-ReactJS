import React, { useState, useEffect } from 'react';
import './Learn.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from '../Learn/DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const Learn = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [formHeight, setFormHeight] = useState('70vh');
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
          const shuffledFlashcards = shuffleArray(data).slice(0, 7);
          setFlashcards(shuffledFlashcards);
          console.log("Lấy dữ liệu thành công", data)
        }
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    fetchData();

  }, [location.search, mounted]);

  useEffect(() => {
    const updateFormHeight = () => {
      const newHeight = document.getElementById('learn-form').scrollHeight + 'px';
      setFormHeight(newHeight);
    };
    updateFormHeight();
  }, [flashcards, currentIndex, isCorrect]);

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

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setIsCorrect(null);
  };

  const handleSkip = () => {
    // Chuyển sang thẻ kế tiếp nếu người dùng bấm nút Don't know
    setCurrentIndex(prevIndex => prevIndex + 1);
    setUserInput('');
    setIsCorrect(null);
    setInputDisabled(false); // Enable lại ô input khi chuyển thẻ
    setFormHeight('70vh'); // Reset chiều cao của form
  };

  const handleSubmit = () => {
    if (userInput.trim().toLowerCase() === flashcards[currentIndex].front_text.trim().toLowerCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        // Chuyển sang thẻ kế tiếp sau 2 giây
        setCurrentIndex(prevIndex => prevIndex + 1);
        setUserInput('');
        setIsCorrect(null);
        setInputDisabled(false);
        setFormHeight('70vh'); // Reset chiều cao của form
      }, 2000);
    } else {
      setIsCorrect(false);
      setInputDisabled(true);
      setFormHeight('90vh');
    }
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
              <button className="hint-button">Show hint</button>
            </div>
            <div className='input-box'>
              {isCorrect === false && (
                <div className="incorrect-message">
                  <p>No, sweat, you're still learning</p>
                </div>
              )}

              {isCorrect === true && (
                <div className="correct-message">
                  <p>Amazing!</p>
                </div>
              )}

              <p>Your answer:</p>
              <input
                type="text"
                value={userInput}
                placeholder='Type the answer'
                onChange={handleInputChange}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                disabled={inputDisabled} // Sử dụng biến state để kiểm soát trạng thái của ô input
              />
              {isCorrect === false && (
                <div className="answer-box">
                  <p>Correct Answer:</p>
                  <input type="text" value={flashcards[currentIndex].front_text} readOnly />
                </div>
              )}
              <div className='control-button'>
                <button className='btn1' onClick={handleSkip}>Don't know?</button>
                <button onClick={handleSubmit}>Answer</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default Learn;
