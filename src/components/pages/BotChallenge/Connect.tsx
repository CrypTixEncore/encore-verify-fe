import React, { useEffect, useMemo, useState } from 'react';
import './BotChallenge.css';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@project-serum/anchor";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";

import BotChallenge from './BotChallenge';
import config from '../../../config';


require('@solana/wallet-adapter-react-ui/styles.css');

export default function Connect() {
    //const [warning, setWarning] = useState({ status: false, msg: '', type: '' });
    const [endpoint, setEndpoint] = useState<string>('')
    const [gatekeeperNetwork, setGatekeeperNetwork] = useState<anchor.web3.PublicKey>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [demo, setDemo] = useState<boolean>(false)

    useEffect(() => {
        const url = new URL(window.location.href);


        setEndpoint(url.searchParams.get('endpoint')!)

        setGatekeeperNetwork(new anchor.web3.PublicKey(url.searchParams.get('gkNetwork')!))

        setDemo(url.searchParams.get('demo')! === 'true')

        setIsLoading(false)
    }, []);


    const wallets = useMemo(() => [
        new PhantomWalletAdapter(),
        new SlopeWalletAdapter(),
        new SolflareWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
    ], []);

    return (
        <div className="container over-m">
            {!isLoading && (
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets}>
                        <WalletModalProvider>
                            <WalletMultiButton disabled={isLoading} className="connect-btn mt-3 text-center" />
                            <div className='text-center mt-3'>
                                <div className="header-text-c">We ain’t a-bot that.</div>
                                <div className="head5">We want to keep this drop safe and let real users<br />  and fans enjoy it - not bots.</div>
                                <div className="head5 mt-4">Select a wallet to get started. Make sure you use the same wallet for the mint.</div>
                            </div>
                            {gatekeeperNetwork && (
                                <BotChallenge gatekeeperNetwork={gatekeeperNetwork}
                                    endpoint={endpoint}
                                    demo={demo}
                                />
                            )}
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            )}
        </div>
    )
}