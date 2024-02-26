import React, { useState } from 'react';
import './Match.scss';
import MatchDemoData from '../Flashcard/FlashcardDemo';
import { Close } from '@mui/icons-material';
// import Select from '@material-ui/core/Select';

const MatchPage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const { flashcards } = MatchDemoData;

  const handleCardClick = (id, frontText, backText) => {
    if (selectedIds.length === 2) {
      return;
    }

    if (selectedIds.find((selectedId) => selectedId.id === id)) {
      return;
    }

    setSelectedIds([...selectedIds, { id, frontText, backText }]);
  };

  // Lấy tối đa 12 thẻ
  const limitedFlashcards = flashcards.slice(0, 6);

  return (
    <div className="match-page">
      <div className="navigation">
        {/* Modes */}
        <select>
          <option value="flashcard">Flashcard</option>
          <option value="learn">Learn</option>
          <option value="test">Test</option>
          <option value="match">Match</option>
        </select>
        <button className="close-button"><Close></Close></button>
      </div>

      {/* Cards */}
      <div className="card-grid">
        {limitedFlashcards.map((flashcard) => (
          <React.Fragment key={flashcard.id}>
            <div
              className={`card-front ${
                selectedIds.find((selectedId) => selectedId.id === flashcard.id)
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleCardClick(flashcard.id, flashcard.front_text, flashcard.back_text)
              }
            >
              {/* Hiển thị frontText của flashcard */}
              <div className="front_text">{flashcard.front_text}</div>
            </div>

            <div
              className={`card-back ${
                selectedIds.find((selectedId) => selectedId.id === flashcard.id)
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                handleCardClick(flashcard.id, flashcard.front_text, flashcard.back_text)
              }
            >
              {/* Hiển thị backText của flashcard */}
              <div className="back_text">{flashcard.back_text}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MatchPage;
