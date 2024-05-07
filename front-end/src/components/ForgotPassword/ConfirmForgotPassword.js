import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./ConfirmForgotPassword.scss";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";

const SettingPage = () => {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const navigate = useNavigate();

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
                    `http://localhost:8080/api/user/confirm-reset-password`,
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
        }
    };

    return (
        <div className="setting-page">
            <Toaster />
            <div className="setting-page-container">
                <span style={{ fontSize: "50px", fontWeight: "bold" }}>Đổi mật khẩu</span>

                <div className="user-infor-container">

                    <div className="change-password-container">
                        <div className="edit-password">
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingPage;
