import React from "react";
import "./SetItem2.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const SetItem2 = (item) => {

  const folder_id = localStorage.getItem("folder_id");
  
  const navigate = useNavigate();
  const handleNavigate = () => {
    localStorage.setItem("set_id", item.setId);
    localStorage.setItem('flashcardTitle', item.title);  
    navigate("/flashcard");
  };
  
  const handleDelete = async () => {
    let set_id = item.setId;
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.delete(
          `http://localhost:8080/api/folder-set/delete/${folder_id}/set/${set_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        window.location.reload();
      } catch (error) {
        alert("Lỗi khi xóa folder:", error.message);
      }
    }
  };

  return (
    <div className="set-item" onClick={() => handleNavigate()}>
      <div className="set-item-content">
        <span className="set-item-title">{item.title}</span>
        <div className="set-item-descriptions"></div>
      </div>

      <div className="set-item-footer">
        <div className="user">
          <span className="user-name">{item.ownername}</span>
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
