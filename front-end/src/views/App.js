import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import CreateSet from '../components/Create-set/CreateSet';
import Home from '../components/Home/Home';
import Flashcard from '../components/Flashcard/Flashcard';
import Match from '../components/Match/Match';
import Sets from '../components/StudySet/Sets/Sets';
import Header from '../components/Header/Header';
import Learn from '../components/Learn/Learn';
import SignUpForm from '../components/AuthForm/SignUpForm';
import LoginForm from '../components/AuthForm/LoginForm';
import { Folder } from '@mui/icons-material';
import Folders from '../components/StudySet/Folders/Folders';
import '../styles/global.scss';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    return (
        <Router>
            <div className="App">
                <Routes>

                    Đăng nhập thành công thì mới chuyển vào HomePage

                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/lastest' element={<HomePage />} />
                    <Route exact path='/signup' element={<SignUpForm />} />
                    <Route exact path='/login' element={<LoginForm />} />
                    <Route exact path='/sets' element={<Sets />} />
                    <Route exact path='/folders' element={<Folder />} />
                    <Route exact path='/create-set' element={<CreateSet />} />
                    <Route exact path='/flashcard' element={<Flashcard />} />
                    <Route exact path='/match' element={<Match />} />
                    <Route exact path='/learn' element={<Learn />} />
                    <Route exact path='/folders' element={<Folders />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
