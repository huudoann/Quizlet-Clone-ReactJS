import React, { useState, useEffect } from 'react';
import './Match.scss';
import axios from 'axios';

const Match = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get('/api/cards');
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleCardClick = (index) => {
    if (selectedCards.length === 2 || selectedCards.includes(index)) {
      return;
    }

    const updatedSelectedCards = [...selectedCards, index];
    setSelectedCards(updatedSelectedCards);

    if (updatedSelectedCards.length === 2) {
      const card1 = cards[updatedSelectedCards[0]];
      const card2 = cards[updatedSelectedCards[1]];

      if (card1.content === card2.content) {
        setTimeout(() => {
          const updatedMatchedPairs = [...matchedPairs, card1.content];
          setMatchedPairs(updatedMatchedPairs);
          setSelectedCards([]);

          const updatedCards = cards.map((card, idx) => {
            if (updatedSelectedCards.includes(idx)) {
              return { ...card, hidden: true };
            }
            return card;
          });
          setCards(updatedCards);
        }, 1000);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="Match">
      <h1>Matching Game</h1>
      <div className="card-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card-match ${selectedCards.includes(index) ? 'selected' : ''} ${matchedPairs.includes(card.content) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {card.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;
