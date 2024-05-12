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
import toast, { Toaster } from "react-hot-toast";
import { Pagination } from "@mui/material";


const FolderPage = () => {
  const [setsInFolder, setSetsInFolder] = useState([]);
  const [showDelFolderConfirmation, setShowDelFolderConfirmation] =
    useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const navigate = useNavigate();
  const folder_id = localStorage.getItem("folder_id");
  const folder_title = localStorage.getItem("folderTitle");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleChangePage = (event, value) => {
    console.log(value);
    setPage(value - 1);
  };

  const handleEditFolder = async () => {
    setShowEditFolder(false);
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.put(
          `http://localhost:8080/api/folder/edit/${folder_id}`,
          {
            title: newFolderTitle,
            description: newFolderDescription,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem("folderTitle", newFolderTitle);
        toast.success("Chỉnh sửa folder thành công");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error("Lỗi khi chỉnh sửa folder:", error.message);
      }
    }
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
        toast.error("Lỗi khi xóa folder:", error.message);
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
            `http://localhost:8080/api/folder/${folder_id}/sets?page=${page}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setSetsInFolder(response.data.content);
          setTotalPages(response.data.totalPages);
          console.log("totalPage:" + totalPages);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách các set:", error.message);
        }
      }
    };

    fetchData();
    console.log("data:" + setsInFolder);
  }, [page]);

  return (
    <div className="folder-page">
      <Toaster />
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
            <ModeEditOutlineIcon
              className="edit-button"
              onClick={() => setShowEditFolder(true)}
            />
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
      {showEditFolder && (
        <div className="edit-folder">
          <div className="overlay"></div>
          <div className="edit-folder-box">
            <div
              className="edit-folder-title"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Chỉnh sửa thư mục
            </div>
            <div className="edit-folder-input">
              <input
                type="text"
                placeholder="Tên thư mục"
                style={{
                  fontSize: "20px",
                  marginTop: "50px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onChange={(e) => setNewFolderTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Mô tả"
                style={{
                  fontSize: "20px",
                  marginTop: "20px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onChange={(e) => setNewFolderDescription(e.target.value)}
              />
            </div>
            <div className="edit-folder-button-container">
              <Button
                onClick={() => setShowEditFolder(false)}
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
                disabled={!newFolderTitle}
                onClick={handleEditFolder}
                style={{
                  backgroundColor: "#303545",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
      {totalPages > 1 && (
        <Pagination className="pagination"
        count={totalPages}
        color="primary"
        onChange={handleChangePage}
      />)}
    </div>
  );
};

export default FolderPage;
