import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "axios";
import SetItem2 from "./SetItem2";
import "./FolderPage.scss";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddModal from "./AddModal";

const FolderPage = () => {
  const [setsInFolder, setSetsInFolder] = useState();

  const folder_id = 1;  

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
            `http://localhost:8080/api/set/${folder_id}/sets`,
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
    console.log(setsInFolder);
  }, []);

  return (
    <div className="folder-page">
      <Header />
      <div className="container">
        <div className="folder-page-header">
          <div className="folder-page-header-info">
            <div className="folder-details">
              <span>2 học phần</span>
              <span>tạo bởi Khanhs </span>
            </div>
            <div className="folder-title">
              <FolderOpenIcon style={{ fontSize: "52px" }}/> 
              <span>Folder 1</span>
            </div>
          </div>
          <div className="folder-page-header-actions">
            <AddModal className="add-button"/>
            <LocalLibraryIcon className="learn-button"/>
            <IosShareIcon className="share-button"/>
            <MoreHorizIcon className="more-options-button"/>
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
