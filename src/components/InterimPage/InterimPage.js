import React from 'react';
import './InterimPage.scss';

const InterimPage = (props) => {
  return (
    <div className="containerWrapper">
      Competition is closed currently...
      <p>{props.textInterim}</p>
    </div>
  )
}

export default InterimPage;