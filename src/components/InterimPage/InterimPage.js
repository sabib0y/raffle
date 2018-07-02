import React from 'react';
import './InterimPage.scss';

const InterimPage = (props) => {
  return (
    <div className="containerWrapper">
      <p>Competition is currently closed...</p>
      <p>{props.textInterim}</p>
    </div>
  )
}

export default InterimPage;