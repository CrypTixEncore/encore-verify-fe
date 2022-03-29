import React, { useState, useEffect, Fragment } from 'react';
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
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

require('@solana/wallet-adapter-react-ui/styles.css');

const BotChallenge = (props: {
    gatekeeperNetwork: anchor.web3.PublicKey,
    demo?: boolean,
    state?: string
}) => {
    const wallet = useWallet()

    const [isLoading, setIsLoading] = useState(false)
    const [warning, setWarning] = useState({ status: false, msg: '', type: '' });
    const [pageState, setPageState] = useState('LANDING')
    const [question, setQuestion] = useState(null);
    const [token, setToken] = useState("");

    const startQuiz = async () => {
        setIsLoading(true)

        let questionsObj;
        if (props.demo) {
            questionsObj = await axios.post(`/bot-questions/demo-quiz/${wallet.publicKey}`);
        } else {
            questionsObj = await axios.post(`/bot-questions/create-bot-quiz/${wallet.publicKey}`);
        }

        const response = questionsObj.data;

        setQuestion(response.question);
        setToken(response.token);

        setPageState('TRIVIA');
        // props?.func('true')
        setIsLoading(false);
        UseGtagEvent('quiz_started', 'Quiz Started');
    }


    if (!wallet.connected) {
        return <>
            <div className='text-center'>
                <div className="header-text-c-h">Prove you’re not a bot.</div>
                <div className="c-h-b">Answer 3 questions. You will have 15 seconds for each question.</div>
                <div className="c-h-b mt-4">Once you pass the challenge you can claim a token which will allow you to mint.</div>
                <button className="btn dd-btn"
                    disabled
                >
                    Start Challenge
                </button>
                <WalletMultiButton disabled={isLoading} className= 'connect-btn mt-2 text-center' />
            </div>
        </>
    }

    return (
        <div className="">
            {pageState === 'LANDING' && (
                <div>
                        {isLoading ? <Loader /> : (
                            <div className="bot-container text-center ">
                                <div className="">
                                    <div className="connect-triva">
                                        <div className="left-col">
                                            {!props.state && (
                                                <>
                                                    <div className="header-text-c-h">Prove you’re not a bot.</div>
                                                    <div className="c-h-b">Answer 3 questions. You will have 15 seconds for each question.</div>
                                                    <div className="c-h-b mt-4">Once you pass the challenge you can claim a token which will allow you to mint.</div>
                                                </>
                                            )}
                                            {props.state === 'FAILED' && (
                                                <>
                                                    <div className="header-text-c-h">You failed!</div>
                                                    <div className="c-h-b">Go ahead and try again.</div>
                                                </>
                                            )}
                                            {props.state === 'SUSPICIOUS' && (
                                                <>
                                                    <div className="header-text-c-h">Suspicious activity detected</div>
                                                </>
                                            )}

                                            <button className="btn d-btn"
                                                disabled={warning.status}
                                                onClick={startQuiz}
                                            >
                                                Start Challenge
                                            </button>
                                            <WalletMultiButton disabled={isLoading} className= 'connect-btn mt-2 text-center' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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