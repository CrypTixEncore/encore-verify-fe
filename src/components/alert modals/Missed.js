import React, { useState, Fragment, useContext } from 'react';
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import Error from '../alert modals/Error';
import './alert.css';
import axios from "../../settings/axios";
import { UseUserContext } from "../../contexts/UserContext";
import EmailContext from '../../contexts/email-notification/emailContext';

const override = css`
      display: block;
      margin: 0 auto;
      border-color: #4000ff;
    `;

const Missed = ({ creator, quiz, closeModal, startQuizFromModal }) => {
    const emailContext = useContext(EmailContext);
    const context = UseUserContext()

    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(true);
    const [code, setCode] = useState('');
    const [reserved, setReserved] = useState(true);
    const [overlay, setOverlay] = useState(true);
    const [warning, setWarning] = useState({ status: false, msg: '' });

    const handleClose = () => {
        setShow(false);
        setOverlay(false);
        closeModal()
    }

    const handleReserved = () => {
        setReserved(true);
    }

    const createErrorMessage = (msg, type) => {
        setWarning({ status: true, msg, type });
        setTimeout(() => {
            setWarning({ status: false, msg: '', type: '' });
        }, 3000)
    }

    const giveAccess = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (code === '') {
            createErrorMessage('Please enter access code', 'danger');
        } else {
            try {
                console.log({
                    creatorId: creator.creatorId,
                    accessCode: code
                }, 'yo')
                const grantAccess = await axios.patch('/creator-profiles/verifyAccessCode', {
                    creatorId: creator.creatorId,
                    accessCode: code
                })

                if (grantAccess.data) {
                    await axios.post('/user-answers/updateQuizAttempted', {
                        userName: context.UserData.userName,
                        quizId: quiz.quizId,
                    });
                    startQuizFromModal();
                } else {
                    createErrorMessage('Invalid access code', 'danger');
                    setCode('');
                }
            } catch (e) {
                console.log(e.message)
            }
        }
        setIsLoading(false);
    }

    return (
        <div className={`bg-modal ${overlay ? 'overlay' : ''}`}>
            <Error status={warning.status} msg={warning.msg} type={warning.type} />
            <div className={`modal ${show ? "show" : ""} modal-card`} >
                <div className="modal-header text-left">
                    <div onClick={handleClose}
                        className="fa fa-close position-absolute"
                        style={{ top: 10, right: 15, cursor: 'pointer' }}
                    />
                    <div className="head3">
                        <div className="t-head">Just missed it!</div>
                        <div className="b-head mt-2">The challenge has ended but you can get notified as soon as the next challenge starts.</div>
                    </div>
                </div>
                <div className="modal-body text-left mt-2">
                    {isLoading && (
                        <ClipLoader loading={isLoading} css={override} size={50} />
                    )}
                    {!isLoading && (
                        <Fragment>
                            <button onClick={handleReserved} disabled={reserved} className="btn-small btn-primary mt-3 notify">
                                {!reserved ? "NOTIFY ME" : "RESERVED"}
                            </button>

                            <form onSubmit={giveAccess} className="mt-3">
                                <i class="fa fa-long-arrow-right position-absolute" style={{ cursor: 'pointer', fontSize: '25px', right: 15, paddingTop: '15px' }} aria-hidden="true" onClick={giveAccess} ></i>
                                <input className="inputField"
                                    type="text"
                                    name="code"
                                    placeholder="Creator access code"
                                    onChange={event => setCode(event.target.value)}
                                />

                            </form>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Missed;
