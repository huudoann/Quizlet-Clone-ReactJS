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
  const [hideMatched, setHideMatched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const set_id = new URLSearchParams(location.search).get('set_id');
        const flashcardsData = await getCardsDataFromSet(set_id);
        // Trộn mảng flashcardsData trước khi cắt lấy 6 phần tử đầu tiên
        const shuffledFlashcards = shuffleArray(flashcardsData);
        setFlashcards(shuffledFlashcards.slice(0, 6));
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    fetchData();
  }, [location.search]);

  useEffect(() => {
    // Kiểm tra nếu tất cả các thẻ đã được kết hợp
    if (matchedIds.length === flashcards.length) {
      // Ẩn các thẻ đã kết hợp sau 0.2s
      setTimeout(() => {
        setHideMatched(true);
      }, 200);
    }
  }, [matchedIds, flashcards.length]);

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
    // Tìm vị trí của thẻ front_text hoặc back_text được chọn trước đó
    const selectedFirstIndex = selectedCards.findIndex(card => card === 'front_text' || card === 'back_text');

    // Nếu chưa có thẻ nào được chọn trước đó
    if (selectedFirstIndex === -1) {
      // Nếu thẻ được chọn là front_text hoặc back_text
      if (type === 'front_text' || type === 'back_text') {
        setSelectedCards(prevSelectedCards => {
          const updatedSelectedCards = [...prevSelectedCards];
          updatedSelectedCards[index] = type;
          return updatedSelectedCards;
        });
      }
    } else {
      // Nếu đã có thẻ front_text hoặc back_text được chọn trước đó và thẻ được chọn là back_text hoặc front_text
      if (type === 'back_text' || type === 'front_text') {
        // Lấy thông tin của thẻ được chọn
        const firstCard = flashcards[selectedFirstIndex];
        const secondCard = flashcards[index];
        console.log(firstCard.card_id);
        console.log(secondCard.card_id);

        if (firstCard.card_id === secondCard.card_id) {
          console.log("dung me r")
        }
        // Nếu hai thẻ cùng loại
        if (firstCard.type === secondCard.type) {
          // Nếu cùng id
          if (firstCard.card_id === secondCard.card_id) {
            // Chuyển màu thành xanh và biến mất sau 0.2s
            setMatchedIds(prevMatchedIds => [...prevMatchedIds, selectedFirstIndex, index]);
            setTimeout(() => {
              setMatchedIds(prevMatchedIds => {
                const updatedMatchedIds = [...prevMatchedIds];
                updatedMatchedIds.splice(updatedMatchedIds.indexOf(selectedFirstIndex), 1);
                updatedMatchedIds.splice(updatedMatchedIds.indexOf(index), 1);
                return updatedMatchedIds;
              });
            }, 200);
          } else {
            // Nếu không cùng id, chuyển màu đỏ và rung lên trong 0.2s
            setUnmatchedIds(prevUnmatchedIds => [...prevUnmatchedIds, selectedFirstIndex, index]);
            setTimeout(() => {
              setUnmatchedIds(prevUnmatchedIds => {
                const updatedUnmatchedIds = [...prevUnmatchedIds];
                updatedUnmatchedIds.splice(updatedUnmatchedIds.indexOf(selectedFirstIndex), 1);
                updatedUnmatchedIds.splice(updatedUnmatchedIds.indexOf(index), 1);
                return updatedUnmatchedIds;
              });
            }, 200);
          }
        }

        // Đặt lại trạng thái của các thẻ không khớp về null sau 0.2s
        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            if (!matchedIds.includes(selectedFirstIndex)) {
              updatedSelectedCards[selectedFirstIndex] = null;
            }
            if (!matchedIds.includes(index)) {
              updatedSelectedCards[index] = null;
            }
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

            {hideMatched || matchedIds.includes(index) ? (
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
            ) : null}
          </React.Fragment>

        ))}
      </div>
    </div>
  );
};

export default MatchPage;