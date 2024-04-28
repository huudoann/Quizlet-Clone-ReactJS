import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./SettingPage.scss";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";

const SettingPage = () => {
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  // const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const username = localStorage.getItem("user_name");
  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.delete(
          `http://localhost:8080/api/user/delete-user/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.clear();
        navigate("/");
        setShowDeleteAccount(false);
      } catch (error) {
        toast.error("Lỗi khi xóa tài khoản:", error.message);
      }
    }
  };

  const handleChangeUsername = async () => {
    setShowChangeUsername(false);
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.put(
          `http://localhost:8080/api/user/change-username/${user_id}`,
          {
            username: newUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.setItem("user_name", newUsername);
        toast.success("Đổi tên người dùng thành công");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast.error("Lỗi khi đổi tên người dùng");
      }
      console.log(newUsername);
    }
  };

  // const handleChangeEmail = async () => {
  //   setShowChangeEmail(false);
  // };

  const handleChangePassword = async () => {
    if (newPassword !== confirmedPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword.trim())) {
      toast.error("Mật khẩu cần phải có ít nhất 6 ký tự, trong đó có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!");
      return;
    }

    setShowChangePassword(false);
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token không tồn tại trong localStorage");
    } else {
      try {
        await axios.put(
          `http://localhost:8080/api/user/change-password/${user_id}`,
          {
            password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        window.location.reload();
        toast.success("Đổi mật khẩu thành công");
      } catch (error) {
        toast.error("Lỗi khi đổi mật khẩu");
      }
      console.log(newUsername);
    }
  };

  return (
    <div className="setting-page">
      <Toaster />
      <Header />
      <div className="setting-page-container">
        <span style={{ fontSize: "50px", fontWeight: "bold" }}>Cài đặt</span>
        <div style={{ marginTop: "50px", fontSize: "20px" }}>
          Thông tin cá nhân
        </div>
        <div className="user-infor-container">
          <div className="username-container">
            <div className="username">
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Tên người dùng
              </span>
              <div>{username}</div>
            </div>
            <Button
              className="edit-username-button"
              onClick={() => setShowChangeUsername(true)}
            >
              Sửa
            </Button>
          </div>
          <div className="email-container">
            <div className="email">
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Email
              </span>
              <div>{email}</div>
            </div>
            {/* <Button
              className="edit-email-button"
              onClick={() => setShowChangeEmail(true)}
            >
              Sửa
            </Button> */}
          </div>
          <div className="change-password-container">
            <div>Đổi mật khẩu</div>
            <Button
              className="change-password-button"
              onClick={() => setShowChangePassword(true)}
            >
              Đổi
            </Button>
          </div>
          <div className="delete-account-container">
            <div className="delete-message">
              <div>Xóa tài khoản</div>
              <span style={{ fontWeight: "normal" }}>
                Thao tác này sẽ xóa tất cả dữ liệu của bạn và không thể hoàn
                tác.
              </span>
            </div>
            <Button
              className="delete-account-button"
              onClick={() => setShowDeleteAccount(true)}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
      {showChangeUsername && (
        <div className="edit-username">
          <div className="overlay"></div>
          <div className="edit-username-box">
            <div
              className="edit-username-title"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Chỉnh sửa tên người dùng
            </div>
            <div className="edit-username-input">
              <input
                type="text"
                placeholder="Tên người dùng mới"
                style={{
                  fontSize: "20px",
                  marginTop: "50px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="edit-username-button-container">
              <Button
                onClick={() => setShowChangeUsername(false)}
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
                disabled={newUsername === ""}
                onClick={handleChangeUsername}
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
      {/* {showChangeEmail && (
        <div className="edit-email">
          <div className="overlay"></div>
          <div className="edit-email-box">
            <div
              className="edit-email-title"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Chỉnh sửa Email
            </div>
            <div className="edit-email-input">
              <input
                type="text"
                placeholder="Email mới"
                style={{
                  fontSize: "20px",
                  marginTop: "50px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                // onChange={(e) => setNewFolderTitle(e.target.value)}
              />
            </div>
            <div className="edit-email-button-container">
              <Button
                onClick={() => setShowChangeEmail(false)}
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
                onClick={handleChangeEmail}
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
      )} */}
      {showChangePassword && (
        <div className="edit-password">
          <div className="overlay"></div>
          <div className="edit-password-box">
            <div
              className="edit-password-title"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Đổi mật khẩu
            </div>
            <div className="edit-password-input">
              <input
                type="password"
                placeholder="Mật khẩu mới"
                style={{
                  fontSize: "20px",
                  marginTop: "50px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                style={{
                  fontSize: "20px",
                  marginTop: "20px",
                  width: "100%",
                  height: "50px",
                  borderRadius: "10px",
                }}
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
            </div>
            <div className="edit-password-button-container">
              <Button
                onClick={() => setShowChangePassword(false)}
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
                disabled={newPassword === "" || confirmedPassword === ""}
                onClick={handleChangePassword}
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
      {showDeleteAccount && (
        <div className="delete-confirm">
          <div className="overlay"></div>
          <div className="delete-account-box">
            <div
              className="edit-email-title"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Xóa tài khoản?
            </div>
            <div
              style={{
                marginTop: "40px",
                paddingBottom: "20px",
                borderBottom: "1px solid #303545",
              }}
            >
              Hành động này sẽ xóa vĩnh viễn tài khoản của bạn và tất cả dữ liệu
              liên quan đến tài khoản Quizlet của bạn. Bạn không thể hoàn tác.
            </div>
            <div className="edit-email-button-container">
              <Button
                onClick={() => setShowDeleteAccount(false)}
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
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Xóa tài khoản
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
