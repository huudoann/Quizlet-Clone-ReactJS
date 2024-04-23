import React from "react";
import Header from "../Header/Header";
import "./SettingPage.scss";
import { Button } from "@mui/material";

const SettingPage = () => {
  return (
    <div className="setting-page">
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
                Tên tài khoản
              </span>
              <div>khanh_nguyen_quoc37</div>
            </div>
            <Button className="edit-username-button">Sửa</Button>
          </div>
          <div className="email-container">
            <div className="email">
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                Email
              </span>
              <div>meoto142@gmail.com</div>
            </div>
            <Button className="edit-email-button">Sửa</Button>
          </div>
          <div className="change-password-container">
            <div>Đổi mật khẩu</div>
            <Button className="change-password-button">Đổi</Button>
          </div>
          <div className="delete-account-container">
            <div className="delete-message">
                <div>Xóa tài khoản</div>
                <span style={{fontWeight: "normal"}}>Thao tác này sẽ xóa tất cả dữ liệu của bạn và không thể hoàn tác.</span>
            </div>
            <Button className="delete-account-button">Xóa tài khoản</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
