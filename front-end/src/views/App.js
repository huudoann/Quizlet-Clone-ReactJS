import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import CreateSet from '../components/Create-set/CreateSet';
import Home from '../components/Home/Home';
import Flashcard from '../components/Flashcard/Flashcard';
import Match from '../components/Match/Match';
import Sets from '../components/StudySet/Sets/Sets';
import Auth from '../components/AuthForm/Auth';
import Header from '../components/Header/Header';
import Learn from '../components/Learn/Learn';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  return (
    <Router>
      <div className="App">
        <Routes>

        {/* Đang fake đã đăng nhập rồi bằng cách nhấn vào Quizlet khi ở trang trước khi đăng nhập
          và ấn vào Home trên Nav của trang HomePage sau khi đăng nhập rồi để coi như đăng xuất */}

          <Route path='/' element={<Home />} />
          <Route path='/lastest' element={<HomePage />} />
          <Route path='/login' element={<Auth />} />

          <Route path='/signup' element={<Auth />} />
          <Route path='/lastest' element={<HomePage />} />
          <Route path='/sets' element={<Sets />} />
          <Route path='/create-set' element={<CreateSet />} />
          <Route path='/flashcard' element={<Flashcard />} />
          <Route path='/match' element={<Match />} />
          <Route path='/learn' element={<Learn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
