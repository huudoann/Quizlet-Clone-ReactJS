import React, { useState, useEffect } from 'react';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import './Auth.scss';

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState('login');

  const switchForm = (formType) => {
    setCurrentForm(formType);
  };

  useEffect(() => {
    // Perform operations when change status
  }, [currentForm]);

  return (
    <div className="auth-page-container">

      <div className="auth-image-container">
        {/* Display img*/}
        <img src="https://assets.quizlet.com/_next/static/media/QZ_Auth_LightV2.d6b0ba3d.png" alt="Auth Image" />
      </div>

      {/* Display status AuthForm*/}
      <div className="auth-form-container">
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
