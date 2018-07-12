import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <div className="socialLinks">
      test
      <ul center>
        <li>
          <a href="#" title="GitHub">
            <i className="fa fa-github"></i>
          </a>
        </li>
        <li>
          <a href="#" title="CodePen">
            <i className="fa fa-codepen"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Dribbble">
            <i className="fa fa-dribbble"></i>
          </a>
        </li>
        <li>
          <a href="#" title="StackOverflow">
            <i className="fa fa-stack-overflow"></i>
          </a>
        </li>
        <li>
          <a href="#" title="LinkedIn">
            <i className="fa fa-linkedin"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Twitter">
            <i className="fa fa-twitter"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Instagram">
            <i className="fa fa-instagram"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Medium">
            <i className="fa fa-medium"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Resume">
            <i className="fa fa-file-pdf-o"></i>
          </a>
        </li>
        <li>
          <a href="#" title="Contact">
            <i className="fa fa-send"></i>
          </a>
        </li>
      </ul>
    </div>
  )
};

export default Footer;