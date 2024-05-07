import React, { useState } from 'react';
import './SignUp.scss';
import { Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';
import DialogConfirmEmail from './DialogConfirmEmail';

const SignUpForm = ({ switchForm }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [termsChecked, setTermsChecked] = useState(false);
    const navigate = useNavigate();
    const [confirmEmailDialogOpen, setConfirmEmailDialogOpen] = useState(false);


    const handleSignUp = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !termsChecked) {
            setError("Không được để trống các trường trên");
            return;
        }
        else if (password.trim() !== confirmPassword.trim()) {
            setError("Mật khẩu không khớp!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;

        if (!emailRegex.test(email.trim())) {
            setError("Email không hợp lệ! Vui lòng nhập đúng định dạng email.");
            return;
        }
        else if (!passwordRegex.test(password.trim())) {
            setError("Mật khẩu cần phải có ít nhất 6 ký tự, trong đó có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!");
            return;
        }

        const userData = {
            username: username,
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:8080/api/auth/signup';

        try {
            const response = await axios.post(apiUrl, userData);
            console.log('Đăng ký thành công:', response.data);

            const token = response.data.token;
            // console.log(token)
            // localStorage.setItem('token', token);
            setConfirmEmailDialogOpen(true);


        } catch (error) {
            if (error.response.status === 400) {
                setError("Email đã tồn tại");
            } else {
                console.error('Lỗi khi đăng ký:', error.message);
                throw error;
            }
        }
    };

    const handleCloseConfirmEmailDialog = () => {
        setConfirmEmailDialogOpen(false);
        navigate('/login');
    };

    const handleInputUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleInputEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleTermsChecked = (e) => {
        setTermsChecked(e.target.checked);
    };

    const handleClickTOS = (e) => {
        navigate('/tos');
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };


    return (
        <div className="auth-form">
            <Toaster />
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
                    label="Tên đăng nhập"
                    value={username}
                    onChange={handleInputUsernameChange}
                    onKeyDown={handleEnterPress}
                    placeholder='Nhập tên người dùng'
                />

                <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    value={email}
                    onChange={handleInputEmailChange}
                    onKeyDown={handleEnterPress}
                    placeholder='Nhập email của bạn'
                />

                <TextField
                    required
                    id="outlined-password-input"
                    label="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleEnterPress}
                    placeholder='Nhập mật khẩu'
                    type="password"
                    autoComplete="current-password"
                />

                <TextField
                    required
                    id="outlined-password-input"
                    label="Xác nhận mật khẩu"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleEnterPress}
                    placeholder='Xác thực mật khẩu của bạn'
                    type="password"
                    autoComplete="current-password"
                />
                <FormControlLabel
                    control={<Checkbox defaultChecked checked={termsChecked} onChange={handleTermsChecked} />}
                    label={
                        <span>
                            Tôi đồng ý với các
                            <Button
                                component="span"
                                color="primary"
                                onClick={handleClickTOS}
                                style={{ textTransform: 'none' }}
                            >
                                Điều khoản và Chính sách bảo mật
                            </Button>

                        </span>
                    }
                />
                {error && <ErrorMessage message={error} />}
                <Button variant="contained" onClick={handleSignUp} style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}>Đăng ký</Button>

                <Button className='switch-status-btn' type='button' onClick={() => navigate('/login')} style={{ width: '100%', border: '1px solid #1976d2', padding: '1rem' }}>
                    <span>Đã có tài khoản? Đăng nhập ngay!</span>
                </Button>
            </Box>

            <DialogConfirmEmail open={confirmEmailDialogOpen} handleClose={handleCloseConfirmEmailDialog} />
        </div>
    );
};

export default SignUpForm;