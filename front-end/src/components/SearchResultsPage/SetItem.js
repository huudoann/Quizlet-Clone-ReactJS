import React from "react";
import "./SetItem.scss";
import { useNavigate } from "react-router-dom";

const SetItem = (item) => {
  console.log(item)
  const navigate = useNavigate();

  const handleNavigate = () => {
    localStorage.setItem('set_id', item.set_id);
    navigate('/flashcard');
  }

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
        <div className="set-item-descriptions">
          <div id="rating">5⭐ {item.rating}</div>
        </div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.user}</span>
        </div>
        <button className="preview-button" onClick={() => console.log("clicked")}>Xem trước</button>
      </div>
    </div>
  );
};

export default SetItem;
