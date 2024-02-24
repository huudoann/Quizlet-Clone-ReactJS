import React, { useState, useEffect } from 'react';
import './Match.scss';

const Match = () => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    // Fake data for demonstration
    const fakeCards = [
      { id: 1, term: 'Apple', definition: 'Táo' },
      { id: 2, term: 'Banana', definition: 'Chuối' },
      { id: 3, term: 'Orange', definition: 'Cam' },
      { id: 4, term: 'Grapes', definition: 'Nho' },
      { id: 5, term: 'Watermelon', definition: 'Dưa hấu' },
      { id: 6, term: 'Pineapple', definition: 'Dứa' },
      { id: 7, term: 'Strawberry', definition: 'Dâu' },
      { id: 8, term: 'Blueberry', definition: 'Việt quất' },
    ];
    // Duplicate cards to form pairs
    const cards = [...fakeCards];
    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards.map((card, index) => ({ ...card })));
  }, []);

  const handleCardClick = (index) => {
    if (selectedCards.length === 2 || selectedCards.includes(index)) {
      return;
    }

    const updatedSelectedCards = [...selectedCards, index];
    setSelectedCards(updatedSelectedCards);

    if (updatedSelectedCards.length === 2) {
      const card1 = cards[updatedSelectedCards[0]];
      const card2 = cards[updatedSelectedCards[1]];

      if (card1.term === card2.definition) {
        setTimeout(() => {
          const updatedMatchedPairs = [...matchedPairs, card1.term, card1.definition];
          setMatchedPairs(updatedMatchedPairs);
          setSelectedCards([]);
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
      <div className="card-match-container">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card-match ${selectedCards.includes(card.index) ? 'selected' : ''} ${matchedPairs.includes(card.term) || matchedPairs.includes(card.definition) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.index)}
          >
            <div className="content">{card.term}</div>
            <div className="content">{card.definition}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;