import React, { useState, useEffect } from 'react';
import './LogIn.scss';
import { Box, TextField, Button, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim()) {
      setError("Nhập Email để tiếp tục");
      return;
    }
    else if (!password.trim()) {
      setError("Nhập mật khẩu để tiếp tục!")
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
      localStorage.setItem('email', email);
      localStorage.setItem('role', response.data.role);
      const successToast = {
        message: 'Đăng nhập thành công!',
        position: 'top-center'
      };
      sessionStorage.setItem('toast', JSON.stringify(successToast));

      if (response.data.role === 'ADMIN') {
        localStorage.setItem('admin_id', user_id);
        navigate('/admin')
      }
      else {
        navigate('/lastest')
      }

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      setError("Thông tin đăng nhập không chính xác, vui lòng thử lại");
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

  return (
    <div className='auth-form'>
      {<Toaster />}
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

        <Link className='forgot-password-link' href="/forgot-password" style={{ textDecoration: 'none' }}>Quên mật khẩu?</Link>

        {error && <ErrorMessage message={error} />}

        <Button variant="contained" onClick={handleLogin} style={{ width: '100%', marginTop: '.5rem', marginBottom: '1rem', padding: '1rem' }}>Đăng nhập</Button>

        <Button className='switch-status-btn' type='button' onClick={() => navigate('/')} style={{ width: '100%', border: '1px solid #1976d2', padding: '1rem' }}>
          <span>Chưa có tài khoản? Đăng ký ngay!</span>
        </Button>
      </Box>
    </div>
  );
};

export default LoginForm;

