import React, { useState } from 'react';
import './LogIn.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';      //
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // add icon EyeSlash for hide/unhide password

const LoginForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {

    console.log('Login:', { email, password });

  };

  const handleForgotPassword = () => {

    console.log('Forgot Password:', email);

  };

  return (
    <div className="auth-form">
      <div className='email-container'>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
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
      <button className='switch-status-btn' type='button' onClick={() => switchForm('register')}>
        <span>New to Quizlet? Create an account</span>
      </button>

    </div>
  );
};

export default LoginForm;
