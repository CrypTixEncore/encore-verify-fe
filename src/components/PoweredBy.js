import React from 'react';
import '../App.css';
import logo from '../utils/e-logo-b.png';

export default function PoweredBy() {
    return (
        <div className="footer mt-2 text-center">
            <div>
                <div>powered by</div>
                <img height="40px" src={logo} alt="encore-logo" />
            </div>
        </div>
    )
}