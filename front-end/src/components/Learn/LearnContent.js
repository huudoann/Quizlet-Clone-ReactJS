import React, { useState } from 'react';
import './LearnContent.scss';

function LearnContent({ vocab, handleAnswer }) {
  const [inputValue, setInputValue] = useState('');

  function handleInput(e) {
    setInputValue(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleAnswer(inputValue);
    setInputValue('');
  }

  return (
    <div className='learn-content-container'>
      <h3>{vocab[0].term}</h3>
      <form className="answer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
        />
        <button className='btn' type='submit'>Answer</button>
      </form>
      <small>Type the answer</small>
    </div>
  );
}

export default LearnContent;