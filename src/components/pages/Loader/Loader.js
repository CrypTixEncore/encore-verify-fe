import React from 'react';
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";
import './Loader.css'


const Loader = () => {
    return (
        <div className="overlay">
            <div className="container">
                <Hypnosis color="#ffffff" width="180px" height="180px" duration="2s" className="buffer" />
            </div>
        </div>
    );
}

export default Loader;
