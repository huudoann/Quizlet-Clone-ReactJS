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
      <h2>Log in</h2>
        <div className='email-container'>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="password-container">
          <label>Password:</label>

          <div className='forgot-password'>
            <span onClick={handleForgotPassword}>Forgot Password?</span>
          </div>
          
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <div className='switch-status'>
          {/* Switch between Login and SignUp Form */}
          <span onClick={() => switchForm('register')}>New to Quizlet? Create an account</span>
        </div>
        
    </div>
  );
};

export default LoginForm;
