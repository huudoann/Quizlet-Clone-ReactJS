import React, { useState, useEffect } from 'react';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import './Auth.scss';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('signup');

  const switchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);

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
