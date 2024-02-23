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
import Auth from '../components/AuthForm/Auth';
import Auth2 from '../components/AuthForm/Auth2';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  return (
    <Router>
      <div className="App">
        {/* <Routes>

          {/* 
          Đang fake đã đăng nhập rồi bằng cách nhấn vào Quizlet khi ở trang trước khi đăng nhập
          và ấn vào Home trên Nav của trang HomePage sau khi đăng nhập rồi để coi như đăng xuất 
          
          Sau khi sửa lại thì cần xóa phần Header của Sets và CreateSet

          <Route exact path='/' element={<Home />} />
          <Route exact path='/lastest' element={<HomePage />} />
          <Route exact path='/signup' element={<Auth />} />
          <Route exact path='/login' element={<Auth2 />} />
          <Route exact path='/lastest' element={<HomePage />} />
          <Route exact path='/sets' element={<Sets />} />
          <Route exact path='/create-set' element={<CreateSet />} />
          <Route exact path='/flashcard' element={<Flashcard />} />
          <Route exact path='/match' element={<Match />} />
          <Route exact path='/learn' element={<Learn />} />
        </Routes> */}

        {<Learn />}
      </div>
    </Router>
  );
}

export default App;
