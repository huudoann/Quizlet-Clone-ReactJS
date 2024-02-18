import React, { useState } from 'react';
import './LogIn.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const LoginForm = ({ switchForm }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const userData = {
      usernameOrEmail: usernameOrEmail, // Sử dụng username hoặc email tùy thuộc vào loại dữ liệu
      password: password,
    };

    const apiUrl = 'http://localhost:8080/api/auth/login';

    try {
      const response = await axios.post(apiUrl, userData);
      console.log('Đăng nhập thành công:', response.data);

      const token = response.data.token;
      console.log(token);
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error.message);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    setUsernameOrEmail(e.target.value);
  };

  const handleForgotPassword = () => {
    console.log('Forgot Password:', usernameOrEmail);
  };

  return (
    <div className="auth-form">
      <div className='username-email-container'>
        <label>Username or Email:</label>
        <input
          type="text"
          value={usernameOrEmail}
          onChange={handleInputChange}
          placeholder='Enter your username or email'
          required />
      </div>

      <div className="password-container">
        <div className="header-of-password">
          <label>Password:</label>

          <span className="forgot-password" onClick={handleForgotPassword}>Forgot Password?</span>
        </div>


        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
        />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="toggle-password-icon"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className='noti-terms'>
        <p>By clicking Log in, you accept Quizlet's Terms of Service and Privacy Policy</p>
      </div>

      <div className='button'>
        <button type="button" onClick={handleLogin}>Log in</button>
      </div>

      {/* Switch between Login and SignUp Form */}
      <button className='switch-status-btn' type='button' onClick={() => switchForm('signup')}>
        <span>New to Quizlet? Create an account</span>
      </button>

    </div>
  );
};

export default LoginForm;
