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
          <a href="https://www.facebook.com/daily.choppins" target="_blank" title="Facebook">
            <FontAwesomeIcon icon={['fab', 'facebook-f']} />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/dailychoppinss" target="_blank" title="Twitter">
          {/* to be added in */}
            <FontAwesomeIcon icon={['fab', 'twitter']} />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/dailychoppinss" target="_blank" title="Instagram">
            <FontAwesomeIcon icon={['fab', 'instagram']} />
          </a>
        </li>
        <li>
          <a href="https://t.me/daaterror" target="_blank" title="Telegram">
            <FontAwesomeIcon icon={['fab', 'telegram']} />
          </a>
        </li>
        {/* <li>
          <a href="#" target="_blank" title="Envelope">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </li> */}
      </ul>
      <p className="disclaimerText">By entering the competition, you consent to your details being used for marketing purposes.</p>
    </div>
  )
};

export default Footer;
