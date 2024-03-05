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
  const [selectedCards, setSelectedCards] = useState(Array(6).fill(null)); // Lưu trữ trạng thái được chọn của từng thẻ
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const set_id = new URLSearchParams(location.search).get('set_id');
        const flashcardsData = await getCardsDataFromSet(set_id);
        // Trộn mảng flashcardsData trước khi lấy 6 phần tử đầu tiên
        const shuffledFlashcards = shuffleArray(flashcardsData);
        //Lấy 6 phần tử đầu tiên - tương ứng với 12 thẻ
        setFlashcards(shuffledFlashcards.slice(0, 6));
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    fetchData();
  }, [location.search]);

  useEffect(() => {
    // Ẩn thông báo lỗi khi reset trạng thái của các thẻ
    if (unmatchedIds.length === 0) {
      setShowErrorMessage(false);
    }
  }, [matchedIds, unmatchedIds]);

  useEffect(() => {
    // Đặt vị trí ngẫu nhiên cho mỗi thẻ
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const randomX = Math.floor(Math.random() * window.innerWidth);
      const randomY = Math.floor(Math.random() * window.innerHeight);
      card.style.left = `${randomX}px`;
      card.style.top = `${randomY}px`;
    });
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
          setUnmatchedIds([selectedFirstIndex, index]);
          setShowErrorMessage(true); // Hiển thị thông báo lỗi khi chọn sai thẻ

          // Ẩn thông báo lỗi sau 2 giây
          setTimeout(() => {
            setShowErrorMessage(false);
          }, 2000);
        } else {
          if (!unmatchedIds.includes(selectedFirstIndex)) {
            setUnmatchedIds(prevUnmatchedIds => [...prevUnmatchedIds, selectedFirstIndex]);
          }
          if (!unmatchedIds.includes(index)) {
            setUnmatchedIds(prevUnmatchedIds => [...prevUnmatchedIds, index]);
          }
        }

        // Thêm thẻ unmatched vào mảng
        setTimeout(() => {
          setUnmatchedIds(prevUnmatchedIds => {
            const updatedUnmatchedIds = [...prevUnmatchedIds];
            updatedUnmatchedIds.splice(updatedUnmatchedIds.indexOf(selectedFirstIndex), 1);
            updatedUnmatchedIds.splice(updatedUnmatchedIds.indexOf(index), 1);
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
        }, 200);
      }
    }
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
            <>
              <div
                className={`card-front_text 
                ${selectedCards[index] === 'front_text' ? 'selected' : ''} 
                ${matchedIds.includes(index) ? 'match' : ''} 
                ${unmatchedIds.includes(index) ? 'no-match' : ''}`}
                onClick={() => handleCardClick(index, 'front_text')}
              >
                <div className="front_text">{flashcard.front_text}</div>
              </div>
              <div
                className={`card-back_text 
                ${selectedCards[index] === 'back_text' ? 'selected' : ''} 
                ${matchedIds.includes(index) ? 'match' : ''} 
                ${unmatchedIds.includes(index) ? 'no-match' : ''}`}
                onClick={() => handleCardClick(index, 'back_text')}
              >
                <div className="back_text">{flashcard.back_text}</div>
              </div>
            </>
          </React.Fragment>
        ))}
      </div>
      {showErrorMessage && (
        <div className="error-message">Bạn đã chọn sai!</div>
      )}
    </div>
  );
};

export default MatchPage;