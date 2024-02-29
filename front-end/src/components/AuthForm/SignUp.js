import React, { useState } from 'react';
import './SignUp.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ switchForm }) => {
    // thêm username, sửa auth-form

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    //server không nhận được mail vs username
    const handleSignUp = async () => {
        const userData = {
            username: username,
            email: email,
            password: password,
        };

        const apiUrl = 'http://localhost:8080/api/auth/signup';

        try {
            const response = await axios.post(apiUrl, userData);
            console.log('Đăng ký thành công:', response.data);

            const token = response.data.token;
            console.log(token)
            localStorage.setItem('token', token);
            navigate('/login');

            return response.data;
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error.message);
            throw error;
        }
    };

    const handleInputUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleInputEmailChange = (e) => {
        setEmail(e.target.value);
    };


    return (
        <div className="auth-form">
            <div className='username-container'>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={handleInputUsernameChange}
                    placeholder='Enter your username'
                    required />
            </div>

            <div className='email-container'>
                <label>Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={handleInputEmailChange}
                    placeholder='Enter your email'
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