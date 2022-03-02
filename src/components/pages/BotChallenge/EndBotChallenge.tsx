import React, {useEffect, useState} from 'react';
import PoweredBy from '../../PoweredBy';
import './EndBotChallenge.css';
import {useConnection, useWallet} from "@solana/wallet-adapter-react";
import {Connection, Message, Transaction} from "@solana/web3.js";
// @ts-ignore
import {base58_to_binary} from '@relocke/base58';

const EndBotChallenge = (props: {
    sendableTransaction: ({ message: string; signatures: (string)[]; } | null), valid?: boolean}) => {

    const wallet = useWallet()
    const connection = useConnection()

    const [verified, setVerified] = useState(false)
    const [wasError, setWasError] = useState(false)

    const fromSerialized = (
        message: Buffer,
        signatures: (string)[]
    ): Transaction => {
        return Transaction.populate(Message.from(message), signatures)
    }

    const signAndSendGkTx = async () => {
        const tx = fromSerialized(
            base58_to_binary(props.sendableTransaction!.message),
            props.sendableTransaction!.signatures
        )

        if (wallet) {
            try {
                const signedTx = await wallet!.signTransaction!(tx)
                const txSignature = await connection.connection.sendRawTransaction(signedTx.serialize())

                console.log(txSignature)

                setVerified(true)
            } catch {
                setWasError(true)
            }
        }
    }

    return (
        <div>
            <div className="row pt-4">
                {(props.valid || verified) && (
                    <div className="col-md-6 container">
                        <div className='header-text-c text-center'>You're verified!</div>
                        <div className="head4 pt-3 text-center"> You can go ahead and close the tab now</div>
                    </div>
                )}
                {!props.valid && !wasError && !verified && (
                    <div className="col-md-6 container">
                        <div className='header-text-c text-center'>You're all done!</div>
                        <div className="head4 pt-3 text-center">Click the button to verify your address</div>
                        {props.sendableTransaction && (
                            <div className="text-center">
                                <button className="btn-small btn-primary mt-4 btn-center bt"
                                        onClick={signAndSendGkTx}
                                >
                                    GET TOKEN
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!verified && wasError && (
                    <div className="col-md-6 container">
                        <div className='header-text-c text-center'>Something went wrong!</div>
                        <div className="head4 pt-3 text-center">Click the button to try again</div>
                        {props.sendableTransaction && (
                            <div className="text-center">
                                <button className="btn-small btn-primary mt-4 btn-center bt"
                                        onClick={signAndSendGkTx}
                                >
                                    GET TOKEN
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <PoweredBy />
        </div>
    )
}

export default EndBotChallenge;
