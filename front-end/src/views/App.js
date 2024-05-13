import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ConfirmForgotPassword from '../components/ForgotPassword/ConfirmForgotPassword';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import UserManagement from '../components/AdminPages/UserManagement';
import DashboardAdmin from '../components/AdminPages/DashboardAdmin';
import SetManager from '../components/AdminPages/SetManager';
import FolderManager from '../components/AdminPages/FolderManager';

function App() {
    const isAuthenticated = false

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Non-protected routes */}
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/signup' element={<SignUpForm />} />
                    <Route exact path='/login' element={<LoginForm />} />
                    <Route exact path='/tos' element={<Tos />} />
                    <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
                    <Route exact path='/reset-password' element={<ConfirmForgotPassword />} />

                    {/* Protected routes */}
                    <Route exact path='/sets' element={<PrivateRoute />}>
                        <Route exact path='/sets' element={<Sets />} />
                    </Route>
                    <Route exact path='/lastest' element={<PrivateRoute />}>
                        <Route exact path='/lastest' element={<HomePage />} />
                    </Route>
                    <Route exact path='/create-set' element={<PrivateRoute />}>
                        <Route exact path='/create-set' element={<CreateSet />} />
                    </Route>
                    <Route exact path='/flashcard' element={<PrivateRoute />}>
                        <Route exact path='/flashcard' element={<Flashcard />} />
                    </Route>
                    <Route exact path='/learn' element={<PrivateRoute />}>
                        <Route exact path='/learn' element={<Learn />} />
                    </Route>
                    <Route exact path='/test' element={<PrivateRoute />}>
                        <Route exact path='/test' element={<Tests />} />
                    </Route>
                    <Route exact path='/match' element={<PrivateRoute />}>
                        <Route exact path='/match' element={<Match />} />
                    </Route>
                    <Route exact path='/folders' element={<PrivateRoute />}>
                        <Route exact path='/folders' element={<Folders />} />
                    </Route>
                    <Route exact path='/search-results-page' element={<PrivateRoute />}>
                        <Route exact path='/search-results-page' element={<SearchResultsPage />} />
                    </Route>
                    <Route exact path='/folder-page' element={<PrivateRoute />}>
                        <Route exact path='/folder-page' element={<FolderPage />} />
                    </Route>
                    <Route exact path='/edit-set' element={<PrivateRoute />}>
                        <Route exact path='/edit-set' element={<EditSet />} />
                    </Route>
                    <Route exact path='/setting' element={<PrivateRoute />}>
                        <Route exact path='/setting' element={<SettingPage />} />
                    </Route>

                    {/* Admin routes */}
                    <Route exact path='/sets-management' element={<AdminRoute />}>
                        <Route exact path='/sets-management' element={<SetManager />} />
                    </Route>
                    <Route exact path='/folders-management' element={<AdminRoute />}>
                        <Route exact path='/folders-management' element={<FolderManager />} />
                    </Route>
                    <Route exact path='/user-management' element={<AdminRoute />}>
                        <Route exact path='/user-management' element={<UserManagement />} />
                    </Route>
                    <Route exact path='/admin' element={<AdminRoute />}>
                        <Route exact path='/admin' element={<DashboardAdmin />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
