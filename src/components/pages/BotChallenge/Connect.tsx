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
import PoweredBy from '../../PoweredBy';
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
        <div>
        <div className="container over-m mt-3">
            {!isLoading && (
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets}>
                        <WalletModalProvider>

                            {gatekeeperNetwork && (
                                <BotChallenge gatekeeperNetwork={gatekeeperNetwork}
                                    endpoint={endpoint}
                                    demo={demo}
                                />
                            )}
                            <WalletMultiButton disabled={isLoading} className="connect-btn mt-3 text-center" />
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            )}
            </div>
            <PoweredBy />
        </div>
    )
}