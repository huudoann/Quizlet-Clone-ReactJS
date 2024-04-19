import React, { useState, useEffect } from 'react';
import './Match.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const MatchPage = () => {
  const [matchedIds, setMatchedIds] = useState([]);
  const [unmatchedPairs, setUnmatchedPairs] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(Array(6).fill(null));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const set_id = localStorage.getItem('set_id');
        const flashcardsData = await getCardsDataFromSet(set_id);

        // Tạo một mảng để chứa tất cả các object chứa front_text và back_text
        const cards = [];

        // Lặp qua mảng content và tạo các object chứa front_text và back_text tương ứng
        flashcardsData.content.forEach(card => {
          cards.push({ card_id: card.card_id, text: card.front_text, type: 'front_text' });
          cards.push({ card_id: card.card_id, text: card.back_text, type: 'back_text' });
        });

        // Tạo mảng rỗng để chứa 6 thẻ đầu tiên
        const initialCards = [];
        const usedCardIds = new Set();

        // Lặp qua các thẻ ngẫu nhiên từ cards cho đến khi đủ 6 thẻ không trùng card_id
        while (initialCards.length < 6 && cards.length > 0) {
          const randomIndex = Math.floor(Math.random() * cards.length);
          const randomCard = cards[randomIndex];

          if (!usedCardIds.has(randomCard.card_id)) {
            initialCards.push(randomCard);
            usedCardIds.add(randomCard.card_id);
          }

          cards.splice(randomIndex, 1); // Xóa thẻ đã được chọn khỏi mảng cards
        }

        // Biến đếm số lần lặp
        let loopCount = 0;
        let processedCards = [];
        // Lặp lại cho đến khi có đủ 6 cặp thẻ hoặc không còn thẻ nào trong cards
        while (processedCards.length < 12 && loopCount < 100) {
          loopCount++;

          // Kiểm tra và thêm thẻ front_text hoặc back_text còn thiếu cho mỗi thẻ
          initialCards.forEach(card => {
            const correspondingCardType = card.type === 'front_text' ? 'back_text' : 'front_text';
            const correspondingCardExists = initialCards.some(c => c.card_id === card.card_id && c.type === correspondingCardType);
            if (!correspondingCardExists && cards.length >= 1) {
              const correspondingCard = cards.find(c => c.card_id === card.card_id && c.type === correspondingCardType);
              initialCards.push(correspondingCard);
            }
          });

          // Lấy 12 thẻ từ initialCards nếu có đủ
          processedCards = initialCards.slice(0, 12);
        }

        setFlashcards(processedCards);
        console.log(processedCards);
        console.log("Lấy dữ liệu thành công");
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };
    fetchData();
  }, [location.search]);

  // const shuffleArray = (array) => {
  //   const newArray = [...array];
  //   for (let i = newArray.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  //   }
  //   return newArray;
  // };

  const handleCloseButtonClick = () => {
    navigate(`/flashcard`);
  };

  const handleCardClick = (index, type, card) => {
    const selectedFirstIndex = selectedCards.findIndex(card => card === 'front_text' || card === 'back_text');

    // Nếu chưa có card nào thì thêm thẻ đang được chọn
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

      // Kiểm tra điều kiện hợp lệ khi chọn 2 thẻ
      if (
        firstCard.card_id === secondCard.card_id && // card_id giống nhau
        firstCardType !== secondCardType // type khác nhau
      ) {
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
        if (unmatchedPairs.length === 0) {
          // Thêm cặp card_id và text của các thẻ không khớp vào mảng unmatchedPairs
          setUnmatchedPairs(prevUnmatchedPairs => [...prevUnmatchedPairs, [firstCard.card_id, firstCard.text]]);
          setUnmatchedPairs(prevUnmatchedPairs => [...prevUnmatchedPairs, [secondCard.card_id, secondCard.text]]);
          setTimeout(() => {
            setUnmatchedPairs(prevUnmatchedIds => {
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
        }

        // Reset trạng thái cho các thẻ sau khi chọn sai
        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            updatedSelectedCards[selectedFirstIndex] = null;
            updatedSelectedCards[index] = null;
            return updatedSelectedCards;
          });
          resetCardStatus();
          resetUnmatchedPairs();
        }, 500);
      }
    }
  };


  const resetCardStatus = () => {
    const cards = document.querySelectorAll('.card-front_text, .card-back_text');
    cards.forEach(card => {
      card.classList.remove('no-match'); // Xóa class 'no-match'
    });
  };

  const resetUnmatchedPairs = () => {
    setUnmatchedPairs([]); // Đặt lại mảng unmatchedPairs về rỗng

  };

  return (
    <div className="match-page">
      <div className="navigation">
        <DropDownMenu />
        <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
      </div>

      <div className="card-grid">
        {flashcards.map((card, index) => {
          const cardType = card.type;

          return (
            <React.Fragment key={index}>
              <div
                className={`card-${cardType}
        ${selectedCards[index] === 'front_text' ? 'selected' : ''}
        ${matchedIds.includes(index) ? 'match' : ''}
        ${unmatchedPairs.some(pair => pair[0] === card.card_id && pair[1] === card[cardType]) ? 'no-match' : ''}`}
                onClick={() => handleCardClick(index, cardType, card)}
                style={unmatchedPairs.some(pair => pair[0] === card.card_id && pair[1] === card[cardType]) ? { animation: 'shake 0.2s ease-in-out' } : matchedIds.includes(index) ? { backgroundColor: 'green', transition: 'background-color 0.2s ease-in-out' } : {}}
              >
                <div className={`${cardType}`}>
                  <div>{card.text}</div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div >

  );
};

export default MatchPage;
