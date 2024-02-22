import React, { useState } from 'react';
import Sidebar from './LearnSideBar.js';
import LearnContent from './LearnContent.js';
import allLearnDemo from './LearnDemo.js';
import './Learn.scss';

const Learn = () => {

  const generateInitialState = (type) => {
    const learn = allLearnDemo[type];
    return {
      type,
      numTerms: learn.length,
      remaining: learn,
      incorrect: [],
      correct: [],
      gameCompleted: false,
      messages: []
    };
  };

  const [learnState, setLearnState] = useState(generateInitialState('ENGLISH'));


  const handleAnswer = (answer) => {
    const { remaining, correct, incorrect, numTerms } = learnState;
    const correctAnswer = remaining[0].definition.toLowerCase();
    let newRemaining = remaining;
    let newCorrect = correct;
    let newIncorrect = incorrect;
    let messages = [];

    if (answer.toLowerCase() === correctAnswer) {
      newCorrect = [...correct, learnState.remaining[0]];
    } else {
      newIncorrect = [...incorrect, learnState.remaining[0]];
      messages.push('The correct answer is actually ' + learnState.remaining[0].definition);
    }

    if (remaining.length === 1) {
      if (newCorrect.length === numTerms) {
        setLearnState({ ...learnState, gameCompleted: true });
      }
      const numCorrect = newCorrect.length;
      messages.push('You have gotten ' + numCorrect + ' out of ' + learnState.numTerms + ' correct');
      setLearnState({
        ...learnState,
        remaining: newIncorrect,
        correct: newCorrect,
        incorrect: [],
        messages
      });
    } else {
      newRemaining = remaining.slice(1);
      setLearnState({
        ...learnState,
        remaining: newRemaining,
        correct: newCorrect,
        incorrect: newIncorrect,
        messages
      });
    }
  };

  const restart = () => {
    const newGame = learnState.correct.length === learnState.numTerms;
    setLearnState(newGame ? generateInitialState(learnState.type) : { ...learnState, messages: [] });
  };

  const getType = () => {
    if (learnState.gameCompleted) return 'restart';
    if (learnState.remaining.length === learnState.numTerms) return 'continue to next round';
    return 'continue';
  };

  const Message = ({ messages, handleClick, type }) => {
    return (
      <div className="learn-message">
        {messages.map((message, i) => <p key={i}>{message}</p>)}
        <button className='btn' onClick={handleClick}>Click to {type}</button>
      </div>
    );
  };

  return (
    <main className="learn-container">
      <Sidebar
        totalCards={learnState.numTerms}
        numRemaining={learnState.remaining.length}
        numCorrect={learnState.correct.length}
        numIncorrect={learnState.incorrect.length}
      />
      {learnState.messages.length ? (
        <Message messages={learnState.messages} handleClick={restart} type={getType()} />
      ) : (
        <LearnContent handleAnswer={handleAnswer} vocab={learnState.remaining} />
      )}
    </main>
  );
};

export default Learn;
