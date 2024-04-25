import React, { useState, useEffect } from 'react';
import "./SetItem.scss";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SetItem = (item) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(null);
  const folder_id = item.folder_id

  const handleNavigate = () => {
    localStorage.setItem('folder_id', item.folder_id);
    localStorage.setItem('folderTitle', item.title);
    navigate(`/folder-page`);
  }

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.username}</span>
        </div>
        <button className="preview-button" onClick={() => console.log("clicked")}>Xem trước</button>
      </div>
    </div>
  );
};

export default SetItem;
