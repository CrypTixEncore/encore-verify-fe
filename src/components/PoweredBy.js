import React from 'react';
import '../App.css';
import logo from '../utils/n-power.png';

export default function PoweredBy() {
    return (
        <div className="footer mt-3 text-center">
            <div>
                <img height="28px" src={logo} alt="encore-logo" />
            </div>
        </div>
    )
}