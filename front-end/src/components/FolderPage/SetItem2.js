import React from "react";
import "./SetItem2.scss";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const SetItem2 = (item) => {
  console.log(item)
  const navigate = useNavigate();

  const handleNavigate = () => {
    localStorage.setItem('set_id', item.set_id);
    navigate('/flashcard');
  }

  const handleDelete = () => {
    alert("delete");
  }

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title} toeic</span>
        <div className="set-item-descriptions">
        </div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.user}Khánh</span>
        </div>
        <div className="delete-icon-container">
          <DeleteIcon onClick={() => handleDelete()} className="delete-button" />
        </div>
      </div>
    </div>
  );
};

export default SetItem2;
