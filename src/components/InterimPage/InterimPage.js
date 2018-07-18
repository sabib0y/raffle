import React from 'react';
import './InterimPage.scss';

export default class InterimPage extends React.Component {
  render () {
    return (
      <div className="containerWrapper">
        <p>Competition is currently closed...</p>
        <p>{this.props.textInterim}</p>
      </div>
    )
  }
}
