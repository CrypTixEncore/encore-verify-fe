import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div >
            <div className="row mt-5">
            <div className="col-md-5 align-self-center p-5">
                    <h2>OH! You're lost.</h2>
                    <p>
                        The page you are looking for does not exist. How you got here is a mystery. But you can click the button below to go back to the homepage.
                    </p>
                    <Link to="/home"><button className='btn align-self-center'><i class="fas fa-arrow-left"></i>  BACK TO HOME</button></Link>
                </div>
                <div className="col-md-7">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4424790/Mirror.png" className="imageB" alt="404 Image" />
                </div>
                
            </div>

        </div>
    );
}

export default NotFound;
