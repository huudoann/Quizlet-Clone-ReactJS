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

const FolderPage = () => {
  const [sets, setSets] = useState();

  const folder_id = localStorage.getItem("folder_id");  

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
          setSets(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách các set:", error.message);
        }
      }
    };

    fetchData();
    console.log(sets);
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
            <AddIcon className="add-button"/>
            <LocalLibraryIcon className="learn-button"/>
            <IosShareIcon className="share-button"/>
            <MoreHorizIcon className="more-options-button"/>
          </div>
        </div>
        <div className="main">
          <div className="content">
            <SetItem2/>
            <SetItem2/>
            <SetItem2/>
            <SetItem2/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderPage;
