import React from 'react';
import './Footer.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faCoffee,
  faEnvelope,
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(
  fab,
  faCoffee,
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
);

const Footer = () => {
  return (
    <div className="footerLinkWrapper">
      <ul>
        <li>
          <a href="#" title="Facebook">
            <FontAwesomeIcon icon={['fab', 'facebook-f']} />
          </a>
        </li>
        <li>
          <a href="#" title="Twitter">
            <FontAwesomeIcon icon={['fab', 'twitter']} />
          </a>
        </li>
        <li>
          <a href="#" title="Instagram">
            <FontAwesomeIcon icon={['fab', 'instagram']} />
          </a>
        </li>
        <li>
          <a href="#" title="Telegram">
            <FontAwesomeIcon icon={['fab', 'telegram']} />
          </a>
        </li>
        <li>
          <a href="#" title="Envelope">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </li>
      </ul>
      <p className="disclaimerText">By clicking submit, you consent to your details being used for marketing purposes.</p>
    </div>
  )
};

export default Footer;