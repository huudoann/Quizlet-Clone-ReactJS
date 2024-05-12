import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmForgotPassword.scss";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@mui/material";

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

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

        const user_id = new URLSearchParams(location.search).get('user_id');

        try {
            await axios.put(
                `http://localhost:8080/api/user/reset-password/${user_id}`,
                {
                    password: newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            const successToast = {
                message: 'Đổi mật khẩu thành công!',
                position: 'top-center'
            };
            sessionStorage.setItem('toast', JSON.stringify(successToast));
            navigate('/login')
        } catch (error) {
            toast.error("Lỗi khi đổi mật khẩu");
        }
        // }
    };

    const handleCancelReset = () => {
        navigate('/')
    }

    return (
        <div className="reset-password-page">
            <Toaster />
            <div className="edit-password">
                <div className="edit-password-box">
                    <span style={{ fontSize: "50px", fontWeight: "bold" }}>Đổi mật khẩu</span>
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
                                paddingLeft: '.5rem'
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
                                paddingLeft: '.5rem'

                            }}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                        />
                    </div>
                    <div className="edit-password-button-container">
                        <Button
                            onClick={handleCancelReset}
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
    );
};

export default ResetPasswordPage;
