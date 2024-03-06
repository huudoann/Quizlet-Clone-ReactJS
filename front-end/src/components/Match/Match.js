import React, { useState, useEffect } from 'react';
import './Match.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const MatchPage = () => {
  const [matchedIds, setMatchedIds] = useState([]);
  const [unmatchedIds, setUnmatchedIds] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(Array(6).fill(null));
  // const [showErrorMessage, setShowErrorMessage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const set_id = new URLSearchParams(location.search).get('set_id');
        const flashcardsData = await getCardsDataFromSet(set_id);

        let selectedFlashcards = [];
        while (selectedFlashcards.length < 12) {
          // Lấy một mảng ngẫu nhiên 12 phần tử từ flashcardsData
          const randomCards = shuffleArray(flashcardsData).slice(0, 12 - selectedFlashcards.length);
          // Loại bỏ các thẻ trùng lặp
          const uniqueCards = removeDuplicates(randomCards, 'card_id');
          selectedFlashcards = selectedFlashcards.concat(uniqueCards);
        }
        // Trộn mảng cuối cùng
        const shuffledFlashcards = shuffleArray(selectedFlashcards);
        setFlashcards(shuffledFlashcards);
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };
    fetchData();
  }, [location.search]);

  const removeDuplicates = (array, key) => {
    return array.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t[key] === item[key]
      ))
    );
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
    navigate(`/flashcard${location.search}`);
  };

  const handleCardClick = (index, type) => {
    const selectedFirstIndex = selectedCards.findIndex(card => card === 'front_text' || card === 'back_text');

    // Nếu chưa có card nào thì thêm thẻ đang selected
    if (selectedFirstIndex === -1) {
      setSelectedCards(prevSelectedCards => {
        const updatedSelectedCards = [...prevSelectedCards];
        updatedSelectedCards[index] = type;
        return updatedSelectedCards;
      });
    } else {
      const secondCard = flashcards[index];
      const firstCard = flashcards[selectedFirstIndex];
      const firstCardType = selectedCards[selectedFirstIndex];
      const secondCardType = type;

      if (firstCard.card_id === secondCard.card_id && firstCardType !== secondCardType) {
        setMatchedIds(prevMatchedIds => [...prevMatchedIds, selectedFirstIndex, index]);

        // Loại bỏ các thẻ đã được kết hợp thành công khỏi danh sách thẻ được chọn
        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            updatedSelectedCards[selectedFirstIndex] = null;
            updatedSelectedCards[index] = null;
            return updatedSelectedCards;
          });
        }, 200);
      } else {
        if (unmatchedIds.length === 0) {
          // Thêm cặp card_id và front_text hoặc back_text của các thẻ không khớp vào mảng unmatchedIds
          setUnmatchedIds(prevUnmatchedIds => [...prevUnmatchedIds, [firstCard.card_id, firstCardType === 'front_text' ? firstCard.front_text : firstCard.back_text]]);
          setUnmatchedIds(prevUnmatchedIds => [...prevUnmatchedIds, [secondCard.card_id, secondCardType === 'front_text' ? secondCard.front_text : secondCard.back_text]]);

          // setShowErrorMessage(true); // Hiển thị thông báo lỗi khi chọn sai thẻ
          // Ẩn thông báo lỗi sau 2 giây
          // setTimeout(() => {
          //   setShowErrorMessage(false);
          // }, 2000);
        }

        // Thêm cặp card_id và front_text hoặc back_text của các thẻ không khớp vào mảng unmatchedIds
        setTimeout(() => {
          setUnmatchedIds(prevUnmatchedIds => {
            const updatedUnmatchedIds = [...prevUnmatchedIds];
            const firstPair = [firstCard.card_id, firstCardType === 'front_text' ? firstCard.front_text : firstCard.back_text];
            const secondPair = [secondCard.card_id, secondCardType === 'front_text' ? secondCard.front_text : secondCard.back_text];

            if (!updatedUnmatchedIds.some(pair => pair[0] === firstPair[0] && pair[1] === firstPair[1])) {
              updatedUnmatchedIds.push(firstPair);
            }
            if (!updatedUnmatchedIds.some(pair => pair[0] === secondPair[0] && pair[1] === secondPair[1])) {
              updatedUnmatchedIds.push(secondPair);
            }
            return updatedUnmatchedIds;
          });
        }, 500);

        // Reset trạng thái cho các thẻ sau khi chọn sai
        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            updatedSelectedCards[selectedFirstIndex] = null;
            updatedSelectedCards[index] = null;
            return updatedSelectedCards;
          });
          resetCardStatus();
          resetUnmatchedIds();
        }, 500);
      }
    }
  }

  const resetCardStatus = () => {
    const cards = document.querySelectorAll('.card-front_text, .card-back_text');
    cards.forEach(card => {
      card.classList.remove('no-match'); // Xóa class 'no-match'
    });
  };

  const resetUnmatchedIds = () => {
    setUnmatchedIds([]); // Đặt lại mảng unmatchedIds về rỗng
  };

  return (
    <div className="match-page">
      <div className="navigation">
        <DropDownMenu />
        <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
      </div>

      <div className="card-grid">
        {flashcards.slice(0, 6).map((flashcard, index) => (
          <React.Fragment key={index}>
            <div
              className={`card-front_text 
              ${selectedCards[index] === 'front_text' ? 'selected' : ''}
              ${matchedIds.includes(index) ? 'match' : ''}
              ${unmatchedIds.some(pair => pair[0] === flashcard.card_id && pair[1] === flashcard.front_text) ? 'no-match' : ''}`}
              onClick={() => handleCardClick(index, 'front_text', flashcard)}
              style={unmatchedIds.some(pair => pair[0] === flashcard.card_id && pair[1] === flashcard.front_text) ? { animation: 'shake 0.2s ease-in-out' } : matchedIds.includes(index) ? { backgroundColor: 'green', transition: 'background-color 0.2s ease-in-out' } : {}}
            >
              <div className="front_text">{flashcard.front_text}</div>
            </div>
          </React.Fragment>
        ))}

        {flashcards.slice(0, 6).map((flashcard, index) => (
          <React.Fragment key={index}>
            <div
              className={`card-back_text 
              ${selectedCards[index] === 'back_text' ? 'selected' : ''}
              ${matchedIds.includes(index) ? 'match' : ''}
              ${selectedCards[index] && unmatchedIds.some(pair => pair[0] === flashcard.card_id && pair[1] === flashcard.back_text) ? 'no-match' : ''} `}
              onClick={() => handleCardClick(index, 'back_text', flashcard)}
              style={selectedCards[index] && unmatchedIds.some(pair => pair[0] === flashcard.card_id && pair[1] === flashcard.back_text) ? { animation: 'shake 0.2s ease-in-out' } : matchedIds.includes(index) ? { backgroundColor: 'green', transition: 'background-color 0.2s ease-in-out' } : {}}
            >
              <div className="back_text">{flashcard.back_text}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {/* {showErrorMessage && (
        <div className="error-message">Bạn đã chọn sai!</div>
      )} */}
    </div >

  );
};

export default MatchPage;