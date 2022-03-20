import React, { useState, } from 'react';
import '../../../App.css';
import axios from '../../../settings/axios';
import BotTrivia from "./BotTrivia";
import Loader from '../Loader/Loader';
import PoweredBy from '../../PoweredBy';
import './BotChallenge.css';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from '@project-serum/anchor'
import EndBotChallenge from './EndBotChallenge';
import security from '../../../settings/security';
import config from '../../../config';
import UseGtagEvent from '../../hooks/useGtagEvent';

require('@solana/wallet-adapter-react-ui/styles.css');

const BotChallenge = (props: {
    gatekeeperNetwork: anchor.web3.PublicKey,
    endpoint: string,
    failed?: boolean,
    demo?: boolean
}) => {
    const wallet = useWallet()

    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState({ status: false, msg: '', type: '' });
    const [pageState, setPageState] = useState('LANDING')
    const [question, setQuestion] = useState(null);
    const [token, setToken] = useState("");
    const [showSignInModal, setShowSignInModal] = useState(false);

    const closeModal = (setShow: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
        setShow(false)
    }

    const startQuiz = async () => {
        setIsLoading(true)

        let questionsObj;
        if (props.demo) {
            questionsObj = await axios.get(`/bot-questions/demo-quiz`)
        } else {
            questionsObj = await axios.get(`/bot-questions/create-bot-quiz`)
        }

        const encryptedData = questionsObj.data;

        setQuestion(encryptedData.question);
        setToken(encryptedData.token)

        setPageState('TRIVIA');
        setIsLoading(false);
        UseGtagEvent('quiz_started', 'Quiz Started');
    }

    if (!wallet.connected) {
        return <>
            <div className='text-center mt-3'>
                <div className="header-text-c-h">Prove you’re not a bot.</div>
                <div className="c-h-b">Answer 3 questions. You will have 15 seconds for each question.</div>
                <div className="c-h-b mt-4">Once you pass the challenge you can claim a token which will allow you to mint.</div>
                <button className="btn d-btn"
                    disabled
                >
                   Start Challenge
                </button>
            </div>  
        </>
    }

    return (
        <div className="container">
            {pageState === 'LANDING' && (
                <div>
                    <>
                        {isLoading ? <Loader /> : (
                            <div className="bot-container text-center ">
                                <div className="container">
                                    <div className="connect-triva">
                                        <div className="left-col">
                                            {!props.failed ? (
                                                <>
                                                    <div className="header-text-c">We ain’t a-bot that.</div>
                                                    <div className="head5">We want to keep this drop safe and let real users<br />  and fans enjoy it - not bots.</div>
                                                    <div className="head5 mt-4">Click on the button below to verify your wallet.</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="header-text-c">You failed!</div>
                                                    <div className="head5">Go ahead and try again.</div>
                                                </>
                                            )
                                            }

                                            <button className="btn d-btn"
                                                disabled={warning.status}
                                                onClick={startQuiz}
                                            >
                                                Start Challenge
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                </div>
            )}
            {pageState === 'TRIVIA' && (
                <BotTrivia startingQuestion={question}
                    wallet={wallet.publicKey!}
                    endpoint={props.endpoint}
                    gatekeeperNetwork={props.gatekeeperNetwork}
                    token={token}
                />
            )}
            {pageState === 'VALID' && (
                <EndBotChallenge sendableTransaction={null} valid={true} />
            )}
        </div>
    )
}

export default BotChallenge