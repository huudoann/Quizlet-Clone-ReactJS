import React from 'react';
import './LearnSideBar.scss';

const ProgressBar = ({ type, numCards, totalCards }) => {
  const getWidth = () => ({
    'width': numCards / totalCards * 100 + '%'
  });

  return (
    <div className='learn-progress-bar'>
      <div className={"bar " + type}>
        <div className="bar-fill" style={getWidth()}></div>
      </div>
      <div className="bar-text">
        <h4>{type}</h4>
        <h4>{numCards}</h4>
      </div>
    </div>
  );
}

const Sidebar = ({ totalCards, numRemaining, numCorrect, numIncorrect }) => (
  <div className='learn-sidebar'>
    <h1>Learning Mode</h1>
    <ProgressBar type='remaining' totalCards={totalCards} numCards={numRemaining} />
    <ProgressBar type='correct' totalCards={totalCards} numCards={numCorrect} />
    <ProgressBar type='incorrect' totalCards={totalCards} numCards={numIncorrect} />
  </div>
);

export default Sidebar;