import { Box, Button, Link, TextField } from "@mui/material";
import './ForgotPassword.scss';
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleEmailClick = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/user/forgot-password?email=${email}`)
            console.log(response)
            toast.success("Đã gửi email để reset password")
        } catch (error) {
            toast.error("Có lỗi xảy ra")
        }
    }

    return (
        <div className='forgot-password-form'>
            <h1>Đặt lại mật khẩu của bạn</h1>
            <p>Nhập địa chỉ email mà bạn đã đăng ký. Chúng tôi sẽ gửi cho bạn một liên kết để đăng nhập và đặt lại mật khẩu.</p>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { marginBottom: '1rem', width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    placeholder='Nhập email người dùng'
                    value={email}
                    onChange={handleEmailChange}
                />
                <Button onClick={handleEmailClick} variant="contained" style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}>Xác nhận email</Button>

            </Box>
            <Toaster />
        </div>
    )

};

export default ForgotPasswordPage;
