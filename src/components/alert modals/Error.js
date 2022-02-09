import React from 'react';
import axios from "../../settings/axios";

export const createErrorMessage = (setWarning, msg) => {
    setWarning({ status: true, msg });
    setTimeout(() => {
        setWarning({ status: false, msg: '' });
    }, 3000)
}

const Error = ({status, msg, type}) => {

    return (
        <div>
            <div className="container mt-1">
                <div className={`alert alert-${type} alert-dismissible fade ${status ? 'show' : ''}`} role="alert">
                    <strong>{msg}</strong>
                    {/* <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button> */}
                </div>
            </div>
        </div>
    );
}

export default Error;
