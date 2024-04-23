import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SetItem2 from "./SetItem2";
import "./FolderPage.scss";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import AddModal from "./AddModal";
import { Button } from "@mui/material";

const FolderPage = () => {
  const [setsInFolder, setSetsInFolder] = useState([]);
  const [showDelFolderConfirmation, setShowDelFolderConfirmation] =
    useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const navigate = useNavigate();
  const folder_id = localStorage.getItem("folder_id");
  const folder_title = localStorage.getItem("folderTitle");

  const handleEditFolder = async () => {
    setShowEditFolder(false);
  };

  const handleDeleteFolder = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.delete(`http://localhost:8080/api/folder/${folder_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/folders");
      } catch (error) {
        alert("Lỗi khi xóa folder:", error.message);
      }
    }
  };

  const handleCancelDeleteFolder = () => {
    setShowDelFolderConfirmation(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");
      // Kiểm tra xem token có tồn tại không
      if (!token) {
        throw new Error("Token không tồn tại trong localStorage");
      } else {
        try {
          // Thực hiện gọi API ở đây
          const response = await axios.get(
            `http://localhost:8080/api/folder/${folder_id}/sets`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSetsInFolder(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách các set:", error.message);
        }
      }
    };

    fetchData();
    console.log("data:" + setsInFolder);
  }, []);

  return (
    <div className="folder-page">
      <Header />
      <div className="container">
        <div className="folder-page-header">
          <div className="folder-page-header-info">
            <div className="folder-details">
              <span> {setsInFolder.length} học phần</span>
            </div>
            <div className="folder-title">
              <FolderOpenIcon style={{ fontSize: "52px" }} />
              <span>{folder_title}</span>
            </div>
          </div>
          <div className="folder-page-header-actions">
            <AddModal className="add-button" />
            <IosShareIcon className="share-button" />
            <ModeEditOutlineIcon className="edit-button" onClick={() => setShowEditFolder(true)}/>
            <DeleteOutlineIcon
              className="delete-folder-button"
              onClick={() => setShowDelFolderConfirmation(true)}
            />
          </div>
        </div>
        <div className="main">
          <div className="content">
            {setsInFolder &&
              setsInFolder.map((item) => (
                <SetItem2 key={item.set_id} {...item} />
              ))}
          </div>
        </div>
      </div>
      {showDelFolderConfirmation && (
        <div className="delete-confirm">
          <div className="overlay"></div>
          <div className="confirmation-box">
            <div className="message">
              Xóa thư mục là thao tác VĨNH VIỄN. Bạn không thể hoàn tác. Bạn
              chắc chắn muốn xóa thư mục này? Học phần trong thư mục này sẽ
              không bị xoá.
            </div>
            <div className="button-container">
              <Button
                onClick={handleCancelDeleteFolder}
                style={{
                  backgroundColor: "#303545",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={handleDeleteFolder}
                style={{
                  backgroundColor: "#FF2A38",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderPage;
