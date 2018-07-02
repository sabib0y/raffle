import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <div>
      <div className="socialLinks">
        <a href="http://codepen.io/mattyfours/" target="_blank"><i className="fa fa-codepen"
                                                                   aria-hidden="true"></i><span>CodePen</span></a>
        <a href="https://www.instagram.com/mattyfours/" target="_blank"><i className="fa fa-instagram"
                                                                           aria-hidden="true"></i><span>Instagram</span></a>
        <a href="https://twitter.com/MattyFours/" target="_blank"><i className="fa fa-twitter"
                                                                     aria-hidden="true"></i><span>Twitter</span></a>
        <a href="https://www.linkedin.com/in/matthew-fournier-47560452/" target="_blank"><i className="fa fa-linkedin"
                                                                                            aria-hidden="true"></i><span>LinkedIn</span></a>
        <a href="https://unsplash.com/@mattyfours" target="_blank"><i className="fa fa-camera"
                                                                      aria-hidden="true"></i><span>Unsplash</span></a>

      </div>
    </div>
  )
};

export default Footer;