import React, { useState, useEffect } from 'react';
import "./SetItem.scss";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SetItem = (item) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(null);
  const [username, setUserName] = useState(null);
  const set_id = item.set_id
  const user_id = item.user_id
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

          const responseUser = await axios.get(`http://localhost:8080/api/user/${user_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          // Tính toán rating từ dữ liệu đánh giá và cập nhật state
          // console.log("rv la", responseReview.data);
          // console.log("name la", responseUser.data.username);
          setRating(responseReview.data);
          setUserName(responseUser.data.username);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách các rv:', error.message);
        }
      }
    };

    fetchData();
  }, [item.set_id]);


  const handleNavigate = () => {
    localStorage.setItem('set_id', item.set_id);
    navigate('/flashcard');
  }

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
        <div className="set-item-descriptions">
          {rating !== null && rating !== 0 && <div id="rating">{rating} ⭐</div>}
        </div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{username}</span>
        </div>
        <button className="preview-button" onClick={() => console.log("clicked")}>Xem trước</button>
      </div>
    </div>
  );
};

export default SetItem;
