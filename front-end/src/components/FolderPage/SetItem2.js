import React from "react";
import "./SetItem2.scss";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const SetItem2 = (item) => {

  const folder_id = localStorage.getItem("folder_id");
  
  const navigate = useNavigate();
  const handleNavigate = () => {
    localStorage.setItem("set_id", item.setId);
    navigate("/flashcard");
  };

  // Xử lý xóa set từ folder sử dụng use-effect có điều kiện mảng set_id thay đổi thì chạy lại

  const handleDelete = () => {
    alert("delete" + item.setId);

  };

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title} toeic</span>
        <div className="set-item-descriptions"></div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.user}Khánh</span>
        </div>

        <div className="delete-icon-container">
          <DeleteIcon
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="delete-set-button"
          />
        </div>
      </div>
    </div>
  );
};

export default SetItem2;
