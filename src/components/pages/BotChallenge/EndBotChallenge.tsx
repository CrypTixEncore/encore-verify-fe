import React, { useState } from 'react';
import PoweredBy from '../../PoweredBy';
import './EndBotChallenge.css';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Message, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import UseGtagEvent from '../../hooks/useGtagEvent';
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const EndBotChallenge = (props: {
    sendableTransaction: ({ message: string; signatures: (string)[]; } | null), valid?: boolean
}) => {

    const wallet = useWallet()
    const connection = useConnection()

    const [verified, setVerified] = useState(false)
    const [wasError, setWasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const fromSerialized = (
        message: Uint8Array,
        signatures: (string)[]
    ): Transaction => {
        return Transaction.populate(Message.from(message), signatures)
    }

    const signAndSendGkTx = async () => {
        const tx = fromSerialized(
            bs58.decode(props.sendableTransaction!.message),
            props.sendableTransaction!.signatures
        )

        if (wallet) {
            try {
                const signedTx = await wallet!.signTransaction!(tx)
                const txSignature = await connection.connection.sendRawTransaction(signedTx.serialize())

                console.log(txSignature)

                setVerified(true);
                UseGtagEvent('transaction_successful', 'Transaction Successful');
            } catch {
                setWasError(true);
                UseGtagEvent('transaction_failed', 'Transaction Failed');
            }
        }
    }

    return (
        <div>
            {(props.valid || verified) && (
                <div>
                    <div className='header-text-c-h'>You're verified!</div>
                    <div className="c-h-b"> You can go ahead and close the tab now</div>
                </div>
            )}
            {!props.valid && !wasError && !verified && (
                <div>
                    <div className='header-text-c-h'>You're all done!</div>
                    <div className="c-h-b">Claim your token and then return to the mint.</div>
                    {props.sendableTransaction && (
                        <button className="btn d-btn"
                            onClick={signAndSendGkTx}
                        >
                            Claim Token
                        </button>
                    )}
                    <WalletMultiButton disabled={isLoading} className='connect-btn mt-2 text-center' />
                </div>
            )}
            {!verified && wasError && (
                <div>
                    <div className='header-text-c-h'>Something went wrong!</div>
                    <div className="c-h-b">Click the button to try again</div>
                    {props.sendableTransaction && (
                        <div className="text-center">
                            <button className="btn d-btn"
                                onClick={signAndSendGkTx}
                            >
                                Claim Token
                            </button>
                        </div>
                    )}
                    <WalletMultiButton disabled={isLoading} className='connect-btn mt-2 text-center' />
                </div>
            )}
        </div>
    )
}

export default EndBotChallenge;
