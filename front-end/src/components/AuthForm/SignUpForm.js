import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import './Auth.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('signup');
  const [isCloseButton, setIsCloseButton] = useState(false);
  const navigate = useNavigate();


  const switchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);

  const toggleCloseButton = () => {
    setIsCloseButton(!isCloseButton);
    navigate('/');
  }

  return (
    <div className="auth-page-container">

      <div className="auth-image-container" >
        {/* Display img*/}
      </div>

      {/* Display status AuthForm*/}
      <div className="auth-form-container">
        {/* Display tabs */}
        <div className="auth-tabs">
          <Button className={currentForm === 'signup' ? 'active' : ''} onClick={() => navigate('/signup')}>Đăng Ký</Button>
          <Button className={currentForm === 'login' ? 'active' : ''} onClick={() => navigate('/login')}>Đăng Nhập</Button>
          <Button className="close-icon" onClick={toggleCloseButton}><FontAwesomeIcon icon={faTimes} /></Button>
        </div>

        {currentForm === 'login' ? (
          <LogIn switchForm={switchForm} />
        ) : (
          <SignUp switchForm={switchForm} />
        )}
      </div>

    </div>
  );
};

export default AuthPage;