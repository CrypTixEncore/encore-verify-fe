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
    failed?: boolean,
    demo?: boolean
}) => {
    const wallet = useWallet()

    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState({ status: false, msg: '', type: '' });
    const [pageState, setPageState] = useState('LANDING')
    const [question, setQuestion] = useState(null);
    const [token, setToken] = useState("");
    /*
    const [showSignInModal, setShowSignInModal] = useState(false);

    const closeModal = (setShow: { (value: React.SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
        setShow(false)
    }

     */

    const startQuiz = async () => {
        setIsLoading(true)

        const payload = {
            wallet: wallet.publicKey
        };
        let questionsObj;
        if (props.demo) {
            questionsObj = await axios.post(`/bot-questions/demo-quiz`, payload);
        } else {
            questionsObj = await axios.post(`/bot-questions/create-bot-quiz`, payload);
        }

        const encryptedData = questionsObj.data;

        setQuestion(encryptedData.question);
        setToken(encryptedData.token);

        setPageState('TRIVIA');
        setIsLoading(false);
        UseGtagEvent('quiz_started', 'Quiz Started');
    }

    if (!wallet.connected) {
        return <>
            <div className='text-center mt-3'>
                <div className="header-text-c">We ain’t a-bot that.</div>
                <div className="head5">We want to keep this drop safe and let real users<br />  and fans enjoy it - not bots.</div>
                <div className="head5 mt-4">Connect your wallet to get started. <br/>Make sure you use the same wallet address for the mint.</div>
            </div>
            <PoweredBy />
        </>
    }

    return (
        <div className="container">
            {pageState === 'LANDING' && (
                <div>
                    <>
                        {isLoading ? <Loader /> : (
                            <div className="bot-container mt-3 pb-5 text-center ">
                                <div className="container pt-2">
                                    <div className="connect-triva">
                                        <div className="left-col mt-2">
                                            {!props.failed ? (
                                                <>
                                                    <div className="header-text-c">We ain’t a-bot that.</div>
                                                    <div className="head5">We want to keep this drop safe and let real users<br />  and fans enjoy it - not bots.</div>
                                                    <div className="head5 mt-4">Click on the button below to verify your wallet address.</div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="header-text-c">You failed!</div>
                                                    <div className="head5">Go ahead and try again.</div>
                                                </>
                                            )
                                            }

                                            <button className="btn-small btn-primary mt-4"
                                                disabled={warning.status}
                                                onClick={startQuiz}
                                            >
                                                VERIFY
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <PoweredBy />
                            </div>
                        )}
                    </>
                </div>
            )}
            {pageState === 'TRIVIA' && (
                <BotTrivia startingQuestion={question}
                    wallet={wallet.publicKey!}
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