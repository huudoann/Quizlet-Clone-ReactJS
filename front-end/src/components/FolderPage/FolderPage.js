import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SetItem2 from "./SetItem2";
import "./FolderPage.scss";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AddModal from "./AddModal";

const FolderPage = () => {
  const [setsInFolder, setSetsInFolder] = useState();
  const navigate = useNavigate();
  const folder_id = 9;  

  const handleDeleteFolder = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.delete(
          `http://localhost:8080/api/folder/${folder_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("xoa thanh cong");
        navigate("/folders");
      } catch (error) {
        alert("Lỗi khi xóa folder:", error.message);
      }
    }
  }

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
  }, [setsInFolder]);

  return (
    <div className="folder-page">
      <Header />
      <div className="container">
        <div className="folder-page-header">
          <div className="folder-page-header-info">
            <div className="folder-details">
              <span> 6 học phần</span>
              <span>tạo bởi  </span>
            </div>
            <div className="folder-title">
              <FolderOpenIcon style={{ fontSize: "52px" }}/> 
              <span>Folder 1</span>
            </div>
          </div>
          <div className="folder-page-header-actions">
            <AddModal className="add-button"/>
            <IosShareIcon className="share-button"/>
            <ModeEditOutlineIcon className="edit-button"/>
            <DeleteOutlineIcon className="delete-folder-button" onClick={handleDeleteFolder}/>
          </div>
        </div>
        <div className="main">
          <div className="content">
            {setsInFolder && setsInFolder.map((item) => (
              <SetItem2 key={item.set_id} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>

  );
};

export default FolderPage;