import React, { useState, useEffect } from 'react';
import './Match.scss';
import { Close } from '@mui/icons-material';
import DropDownMenu from './DropDownMenu';
import getCardsDataFromSet from '../../utils/getCardsDataFromSet';

const MatchPage = async () => {
  const [selectedFrontId, setSelectedFrontId] = useState(null);
  const [selectedBackId, setSelectedBackId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [unmatchedIds, setUnmatchedIds] = useState([]);
  const flashcards = await getCardsDataFromSet();

  useEffect(() => {
    // Xử lý khi có hai thẻ được chọn
    if (selectedFrontId !== null && selectedBackId !== null) {
      const firstFrontCard = flashcards.find((card) => card.id === selectedFrontId);
      const firstBackCard = flashcards.find((card) => card.id === selectedBackId);

      // Kiểm tra nếu hai thẻ có cùng id
      if (firstFrontCard.id === firstBackCard.id) {
        // Nếu hai thẻ có cùng id, thì đợi 0.2s và thêm class 'match' vào các thẻ
        setTimeout(() => {
          setMatchedIds([...matchedIds, selectedFrontId]);
          setSelectedFrontId(null);
          setSelectedBackId(null);
        }, 200);
      } else {
        // Nếu hai thẻ có id khác nhau, thì đợi 0.2s và xoá các thẻ khỏi danh sách được chọn
        setTimeout(() => {
          setSelectedFrontId(null);
          setSelectedBackId(null);
          // Sau khi hiển thị hiệu ứng rung trong 0.2 giây, xóa tất cả các thẻ không khớp khỏi trạng thái không khớp
          setTimeout(() => {
            setUnmatchedIds([]);
          }, 200);
        }, 200);
        // Lưu các thẻ không khớp vào trạng thái không khớp
        setUnmatchedIds([selectedFrontId, selectedBackId]);
      }
    }
  }, [selectedFrontId, selectedBackId, flashcards, matchedIds]);



  const handleFrontCardClick = (id) => {
    if (!matchedIds.includes(id)) {
      if (unmatchedIds.includes(id)) {
        // Nếu thẻ đã được chọn và không khớp, loại bỏ khỏi danh sách không khớp khi chọn lại
        setUnmatchedIds(unmatchedIds.filter((cardId) => cardId !== id));
      }
      setSelectedFrontId(id);
    }
  };

  const handleBackCardClick = (id) => {
    if (!matchedIds.includes(id)) {
      if (unmatchedIds.includes(id)) {
        // Nếu thẻ đã được chọn và không khớp, loại bỏ khỏi danh sách không khớp khi chọn lại
        setUnmatchedIds(unmatchedIds.filter((cardId) => cardId !== id));
      }
      setSelectedBackId(id);
    }
  };

  // Lấy tối đa 12 thẻ
  const limitedFlashcards = flashcards.slice(0, 6);

  return (
    <div className="match-page">
      <div className="navigation">
        <DropDownMenu />
        <button className="close-button"><Close></Close></button>
      </div>

      {/* Cards */}
      <div className="card-grid">
        {limitedFlashcards.map((flashcard) => (
          <React.Fragment key={flashcard.id}>
            <div
              className={`card-front ${selectedFrontId === flashcard.id ? 'selected' : ''} ${matchedIds.includes(flashcard.id) ? 'match' : ''} ${unmatchedIds.includes(flashcard.id) ? 'no-match' : ''}`}
              onClick={() => handleFrontCardClick(flashcard.id)}
            >
              {/* Hiển thị frontText của flashcard */}
              <div className="front_text">{flashcard.front_text}</div>
            </div>

            <div
              className={`card-back ${selectedBackId === flashcard.id ? 'selected' : ''} ${matchedIds.includes(flashcard.id) ? 'match' : ''} ${unmatchedIds.includes(flashcard.id) ? 'no-match' : ''}`}
              onClick={() => handleBackCardClick(flashcard.id)}
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
