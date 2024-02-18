import React, { useState } from 'react';
import './SignUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const SignUpForm = ({ switchForm }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async () => {
        const userData = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };

        const apiUrl = 'http://localhost:8080/api/auth/signup';

        try {
            const response = await axios.post(apiUrl, userData);
            console.log('Đăng ký thành công:', response.data);

            const token = response.data.token;
            console.log(token)
            localStorage.setItem('token', token);
            
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message);
            throw error;
        }
    };

    const handleInputChange = (e) => {
        setUsernameOrEmail(e.target.value);
    };

    const isEmail = (input) => {
        return /\S+@\S+\.\S+/.test(input);
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
                <label>Password:</label>
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

            <div className='squaredcheck'>
                <label htmlFor="squaredcheck">
                    <input type="checkbox" value="None" id="squaredcheck" className="checkbox" name="check" />
                    <span>I accept Quizlet's Terms of Services and Privacy Policy</span>
                </label>
            </div>

            <div className='button'>
                <button type="button" onClick={handleSignUp}>Sign up</button>
            </div>

            {/* Switch between Login and SignUp Form */}
            <button className='switch-status-btn' type='button' onClick={() => switchForm('login')}>
                <span>Already have an account? Log in</span>
            </button>
        </div>
    );
};

export default SignUpForm;
