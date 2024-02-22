import logo from './logo.svg';
import './App.scss';
import AuthForm from '../components/AuthForm/Auth';
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
      <Sets />
    </div>
  );
}

export default App;
