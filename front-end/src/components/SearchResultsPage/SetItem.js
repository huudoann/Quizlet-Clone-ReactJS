import React, { useState, useEffect } from "react";
import "./SetItem.scss";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SetItem = (item) => {
  console.log(item)
  const [rating, setRating] = useState(null);
  const navigate = useNavigate();
  const set_id = item.set_id;

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại trong localStorage');
      } else {
        try {

          const responseReview = await axios.get(`http://localhost:8080/api/review/sets/${set_id}/reviews`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          // console.log("rv la", responseReview.data);
          setRating(responseReview.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách các rv:', error.message);
        }
      }
    };

    fetchData();
  }, []);

  const handleNavigate = async () => {
    localStorage.setItem('set_id', item.set_id);
    localStorage.setItem('flashcardTitle', item.title);
    localStorage.setItem('public', item.public);
    localStorage.setItem('description', item.description);
    const userInfo = await axios.get(`http://localhost:8080/api/user/username/${item.ownerName}`);
    localStorage.setItem('ownerId', userInfo.data.user_id)
    navigate('/flashcard');
  }

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
        <div className="set-item-descriptions">
          <div id="rating">{Math.round(rating * 100) / 100} ⭐</div>
        </div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.user}</span>
        </div>
        <button className="preview-button" onClick={() => console.log("clicked")}>Xem</button>
      </div>
    </div>
  );
};

export default SetItem;
