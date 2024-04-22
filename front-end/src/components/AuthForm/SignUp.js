import React, { useState } from 'react';
import './SignUp.scss';
import { Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const SignUpForm = ({ switchForm }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(false);
    const [error, setError] = useState(null);
    const [termsChecked, setTermsChecked] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !termsChecked) {
            setError("Không được để trống các trường trên");
            return;
        }
        else if (password.trim() !== confirmPassword.trim()) {
            setError("Mật khẩu không khớp!");
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
            console.log(token)
            localStorage.setItem('token', token);
            navigate('/login');

            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message);
            throw error;
        }
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
                            I accept
                            <Button
                                component="span"
                                color="primary"
                                onClick={handleClickTOS}
                                style={{ textTransform: 'none' }}
                            >
                                Terms of Services and Privacy Policy
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
        </div>
    );
};

export default SignUpForm;