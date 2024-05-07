import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import CreateSet from '../components/Create-set/CreateSet';
import Home from '../components/Home/Home';
import Flashcard from '../components/Flashcard/Flashcard';
import Match from '../components/Match/Match';
import Sets from '../components/StudySet/Sets/Sets';
import Learn from '../components/Learn/Learn';
import SignUpForm from '../components/AuthForm/SignUpForm';
import LoginForm from '../components/AuthForm/LoginForm';
import Folders from '../components/StudySet/Folders/Folders';
import Tos from '../components/PrivacyPolicy/Tos';
import Tests from '../components/Testss/Tests';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage';
import EditSet from '../components/EditSet/EditSet';
import FolderPage from '../components/FolderPage/FolderPage';
import SettingPage from '../components/SettingPage/SettingPage';
import '../styles/global.scss';
import ForgotPasswordPage from '../components/ForgotPassword/ForgotPassword';
import ConfirmForgotPassword from '../components/ForgotPassword/ConfirmForgotPassword'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);



    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/lastest' element={<HomePage />} />
                    <Route exact path='/signup' element={<SignUpForm />} />
                    <Route exact path='/login' element={<LoginForm />} />
                    <Route exact path='/sets' element={<Sets />} />
                    <Route exact path='/create-set' element={<CreateSet />} />
                    <Route exact path='/flashcard' element={<Flashcard />} />
                    <Route exact path='/learn' element={<Learn />} />
                    <Route exact path='/test' element={<Tests />} />
                    <Route exact path='/match' element={<Match />} />
                    <Route exact path='/folders' element={<Folders />} />
                    <Route exact path='/tos' element={<Tos />} />
                    <Route exact path='/search-results-page' element={<SearchResultsPage />} />
                    <Route exact path='/folder-page' element={<FolderPage />} />
                    <Route exact path='/edit-set' element={<EditSet />} />
                    <Route exact path='/setting' element={<SettingPage />} />
                    <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
                    <Route exact path='/reset-password' element={<ConfirmForgotPassword />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
