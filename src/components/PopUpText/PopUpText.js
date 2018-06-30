// import React from 'react';
//
// export const PopUpText = () => {
//   return (
//     <div>
//       <h3>Thanks for taking part!!</h3>
//       <h5>We'll be in touch via email or mobile number if you're our lucky winner!!!</h5>
//     </div>
//   )
// };


import React, { Component } from 'react';
import '../Home/PopUp.scss';

import {
  PopupboxManager,
  PopupboxContainer
} from 'react-popupbox';

export class PopUpText extends Component {
  updatePopupbox() {
    const content = (
      <div>
        <span>Update popupbox with new content and config</span>
        <button onClick={PopupboxManager.close}>Close</button>
      </div>
    );

    PopupboxManager.update({
      content,
      config: {
        titleBar: {
          text: 'Updated!'
        }
      }
    })
  }

  openPopupbox() {
    const content = (
      <div>
        {/*<button onClick={() => this.updatePopupbox()}>Update!</button>*/}
      </div>
    )

    PopupboxManager.open({
      content,
      config: {
        titleBar: {
          enable: true,
          text: `Wcce'll be in touch via email or mobile number 
                if you're our lucky winner!!!`,
          header:  `Thanks for taking part!!`

  },
        fadeIn: true,
        fadeInSpeed: 500
      }
    })
  }

  render() {
    return (
      <div>
        <button onClick={() => this.openPopupbox()}>Click me</button>
        <PopupboxContainer />
      </div>
    )
  }
}