import logo from './logo.svg';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from '../components/Home/HomePage';
import CreateSet from '../components/Create-set/CreateSet';
import Home from '../components/Home/Home';
import Flashcard from '../components/Flashcard/Flashcard';
import Match from '../components/Match/Match';
import Sets from '../components/StudySet/Sets/Sets';
import Auth from '../components/AuthForm/Auth';
import Header from '../components/Header/Header';


function App() {
  return (
    <div className="App">


      {/* <Link to="/lastest"></Link >
      <Link to="/sets"></Link>
      <Link to="/create-set"></Link >
      <Routes>
        <Route path='/lastest' element={<HomePage />} />
        <Route path='/sets' element={<Sets />} />
        <Route path='/create-set' element={<CreateSet />} />
      </Routes> */}


      <Link to="/"></Link>
      <Link to="/signup"></Link>
      <Link to="/login"></Link>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Auth />} />
        <Route path='/login' element={<Auth />} />
      </Routes>



    </div>
  );
}

export default App;
