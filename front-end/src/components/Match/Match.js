import React, { useState, useEffect } from 'react';
import './Match.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';

const MatchPage = () => {
  const [matchedIds, setMatchedIds] = useState([]);
  const [unmatchedPairs, setUnmatchedPairs] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(Array(6).fill(null));
  const [unmatchedIndices, setUnmatchedIndices] = useState([]);
  const navigate = useNavigate();
  const set_id = localStorage.getItem('set_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flashcardsData = await Request.Server.get(endPoint.getAllCardsInSet(set_id));

        let cards = [];
        let flashcardsContent = flashcardsData.content;
        flashcardsContent.forEach(card => {
          const cardFront = { card_id: card.card_id, text: card.front_text, type: 'front_text' };
          const cardBack = { card_id: card.card_id, text: card.back_text, type: cardFront.type === 'front_text' ? 'back_text' : 'front_text' };
          cards = [...cards, cardFront, cardBack];
        });
        const initialCards = [];
        const usedCardIds = new Set();
        let loopCnt = 0;

        while (initialCards.length < 6 && cards.length > 0 && loopCnt < 100) {
          loopCnt++;
          const randomIndex = Math.floor(Math.random() * cards.length);
          const randomCard = cards[randomIndex];

          // Kiểm tra xem id của randomCard đã được sử dụng chưa
          if (!usedCardIds.has(randomCard.card_id)) {
            initialCards.push(randomCard);
            usedCardIds.add(randomCard.card_id);
          }
        }
        let loopCount = 0;
        let processedCards = [...initialCards];
        const addedCardIds = [];
        while (processedCards.length < 12 && loopCount < 2) {
          loopCount++;

          initialCards.forEach(initialCard => {
            const correspondingCardType = initialCard.type;
            cards.forEach(card => {
              if (card.card_id === initialCard.card_id && card.type !== correspondingCardType) {
                // Kiểm tra xem card_id đã được thêm vào processedCards chưa
                if (!addedCardIds.includes(card.card_id)) {
                  processedCards.push(card);
                  addedCardIds.push(card.card_id);
                }
              }
            });
          });
        }

        processedCards = processedCards.slice(0, 12);

        // console.log("processed", processedCards);
        setFlashcards(processedCards);
        console.log("Lấy dữ liệu thành công");
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    if (set_id) {
      fetchData(set_id);
    }
  }, [])

  const handleCloseButtonClick = () => {
    navigate(`/flashcard`);
  };

  const handleCardClick = (index, type, card) => {
    console.log(selectedCards)
    const selectedFirstIndex = selectedCards.findIndex(card => card === 'front_text' || card === 'back_text');

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

      if (
        firstCard.card_id === secondCard.card_id &&
        firstCardType !== secondCardType
      ) {
        setMatchedIds(prevMatchedIds => [...prevMatchedIds, selectedFirstIndex, index]);

        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            updatedSelectedCards[selectedFirstIndex] = null;
            updatedSelectedCards[index] = null;
            return updatedSelectedCards;
          });
        }, 500);
      } else {
        if (unmatchedPairs.length === 0) {
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

        setUnmatchedIndices([selectedFirstIndex, index]);

        setTimeout(() => {
          setSelectedCards(prevSelectedCards => {
            const updatedSelectedCards = [...prevSelectedCards];
            updatedSelectedCards[selectedFirstIndex] = null;
            updatedSelectedCards[index] = null;
            return updatedSelectedCards;
          });

          setTimeout(() => {
            setUnmatchedIndices([]);
          }, 500);

          setUnmatchedPairs([]);
        }, 500);
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
        {flashcards.map((card, index) => {
          const cardType = card.type;

          return (
            <React.Fragment key={index}>
              <div
                className={`card-${cardType}
                  ${selectedCards[index] === 'front_text' || selectedCards[index] === 'back_text' ? 'selected' : ''}
                  ${matchedIds.includes(index) ? 'match' : ''}
                  ${unmatchedIndices.includes(index) ? 'no-match' : ''}`}
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
    </div>
  );
};

export default MatchPage;
