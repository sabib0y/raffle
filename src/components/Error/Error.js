import React from 'react';
import Footer from '../Footer/Footer.component'

const Error = () => {
  return(
    <div className='container-fluid appWrapper'>
      <div>
        <h3 className="headerText">Oopsy! not feeling too good today :( </h3>
      </div>
      <p className="centreText">Error redirect here..</p>
      <div>
        <Footer />
      </div>
    </div>
  )
};

export default Error;