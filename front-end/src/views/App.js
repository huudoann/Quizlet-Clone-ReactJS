import logo from './logo.svg';
import './App.scss';
import AuthForm from '../components/AuthForm/Auth';
import HomePage from '../components/Home/HomePage';
import CreateSet from '../components/Create-set/CreateSet';
import Home from '../components/Home/Home';
import Flashcard from '../components/Flashcard/Flashcard';
import Match from '../components/Match/Match';

function App() {
  return (
    <div className="App">
      <AuthForm />
    </div>
  );
}

export default App;
