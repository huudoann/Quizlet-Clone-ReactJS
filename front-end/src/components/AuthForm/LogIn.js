import React, { useState } from 'react';
import './LogIn.scss';
import { Box, TextField, Button } from '@mui/material';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Your username cannot be blank!");
      return;
    }
    else if (!password.trim()) {
      setError("Your password cannot be blank!")
    }

    const userData = {
      email: email,
      password: password,
    };

    const apiUrl = 'http://localhost:8080/api/auth/login';

    try {
      const response = await axios.post(apiUrl, userData);
      console.log('Đăng nhập thành công:', response.data);
      const token = response.data.token;
      const user_id = response.data.user_id;
      const username = response.data.username;
      console.log(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_name', username);
      navigate('/lastest');

      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      setError("The login details you entered are incorrect. Try again...");
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password:', email);
  };

  return (
    <div className='auth-form'>
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
          value={email}
          onChange={handleInputChange}
          onKeyDown={handleEnterPress}
          placeholder='Nhập email người dùng'
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

        {error && <ErrorMessage message={error} />}
        <Button variant="contained" onClick={handleLogin} style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}>Đăng nhập</Button>

        <Button className='switch-status-btn' type='button' onClick={() => navigate('/')} style={{ width: '100%', border: '1px solid #1976d2', padding: '1rem' }}>
          <span>Chưa có tài khoản? Đăng ký ngay!</span>
        </Button>
      </Box>
    </div>
  );
};

export default LoginForm;

