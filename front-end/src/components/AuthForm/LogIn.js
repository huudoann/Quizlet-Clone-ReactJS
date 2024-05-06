import React, { useState, useEffect } from 'react';
import './LogIn.scss';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu có toast trong session storage
    const toastData = sessionStorage.getItem('toast');
    if (toastData) {
      const toastObject = JSON.parse(toastData);
      // Hiển thị toast
      toast.success(toastObject.message, {
        position: toastObject.position
      });
      // Xóa toast khỏi session storage
      sessionStorage.removeItem('toast');
    }
  }, []);

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
      localStorage.setItem('email', email);
      const successToast = {
        message: 'Đăng nhập thành công!',
        position: 'top-center'
      };
      sessionStorage.setItem('toast', JSON.stringify(successToast));

      navigate('/lastest')

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      if (error.response && error.response.data && error.response.data.error === "Forbidden") {
        setError("Bạn cần kích hoạt Email trước.");
      } else {
        setError("Thông tin đăng nhập không chính xác, vui lòng thử lại");
      }
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

  // const handleForgotPassword = () => {
  //   console.log('Forgot Password:', email);
  // };

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

