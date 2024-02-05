import React, { useState } from 'react';
import './SignUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';       //
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';  // add icon EyeSlash for hide/unhide password


const SignUpForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {

    console.log('SignUp:', { email, password});

  };

  return (
    <div className="auth-form">
      <h2>Sign up</h2>
        <div className='email-container'>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="password-container">
          <label>Password:</label>
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

        <div className='squaredcheck'>
          <label for="squaredcheck">
            <input type="checkbox" value="None" id="squaredcheck" class="checkbox" name="check"  />
            <span>I accept Quizlet's Terms of Services and Privacy Policy</span></label>
        </div>

        <div className='button'>
          <button type="button" onClick={handleSignUp}>Sign up</button>
        </div>
        
        <div className='switch status'>
          <span onClick={() => switchForm('login')}>Already have an account? Log in</span>
        </div>
        
        
    </div>
  );
};

export default SignUpForm;