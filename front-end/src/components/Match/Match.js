import React, { useState, useEffect } from 'react';
import './Match.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';
import { endPoint } from '../../utils/api/endPoint';
import { Request } from '../../utils/axios';
import { Button } from '@mui/material';

const MatchPage = () => {
  const [matchedIds, setMatchedIds] = useState([]);
  const [unmatchedPairs, setUnmatchedPairs] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(Array(6).fill(null));
  const [unmatchedIndices, setUnmatchedIndices] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // Thời gian đã trôi qua
  const [timerRunning, setTimerRunning] = useState(true); // Trạng thái của đồng hồ
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

        let loopCount1 = 0;
        while (initialCards.length < 6 && cards.length > 0 && loopCount1 < 100) {
          loopCount1++;
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

        setFlashcards(processedCards);
        console.log("Lấy dữ liệu thành công");
        setTimerRunning(true)
      } catch (error) {
        console.error('Lỗi lấy cards:', error);
      }
    };

    if (set_id) {
      fetchData(set_id);
    }
  }, [])

  useEffect(() => {
    let check = matchedIds.length === flashcards.length;
    console.log(timerRunning, check);
    let intervalId;
    if (check === true && timerRunning) {
      setTimerRunning(false);
      return
    }
    if (timerRunning) {
      intervalId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);
    }


    return () => clearInterval(intervalId);
  }, [matchedIds, flashcards, timerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleCloseButtonClick = () => {
    navigate(`/flashcard`);
  };

  const handleCardClick = (index, type, card) => {
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
        }, 100);
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
          }, 100);
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
          }, 100);

          setUnmatchedPairs([]);
        }, 100);
      }
    }
  };

  return (
    <div className="match-page">
      <div className="navigation">
        <DropDownMenu />
        {timerRunning && <div className="timer">{formatTime(elapsedTime)}</div>}
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

      {matchedIds.length === flashcards.length && !timerRunning && (
        <div className="summary">
          <p>Thời gian hoàn thành: {formatTime(elapsedTime)}</p>
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: 'blue', color: '#fff', padding: '1rem', margin: 'auto', display: 'block' }}>Chơi lại</Button>
        </div>
      )}
    </div>
  );
};

export default MatchPage;
