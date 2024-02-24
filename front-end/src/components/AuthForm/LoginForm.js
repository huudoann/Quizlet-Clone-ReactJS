import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import './Auth.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBell, faUser, faStickyNote, faFolder, faUsers, faTimes, } from '@fortawesome/free-solid-svg-icons';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login');
  const [isCloseButton, setIsCloseButton] = useState(false);
  const navigate = useNavigate ();


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
          <button className={currentForm === 'signup' ? 'active' : ''} onClick={() => switchForm('signup')}>Sign Up</button>
          <button className={currentForm === 'login' ? 'active' : ''} onClick={() => switchForm('login')}>Log In</button>
          <button className="close-icon" onClick={toggleCloseButton}><FontAwesomeIcon icon={faTimes} /></button>
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