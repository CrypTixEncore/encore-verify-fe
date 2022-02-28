import React, {useEffect, useMemo, useState} from 'react';
import './BotChallenge.css';
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton, WalletConnectButton } from "@solana/wallet-adapter-react-ui";
import * as anchor from "@project-serum/anchor";
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";

import BotChallenge from './BotChallenge'
import {useParams} from "react-router-dom";

import '@solana/wallet-adapter-react-ui/styles.css';

export default function Connect() {
    //const [warning, setWarning] = useState({ status: false, msg: '', type: '' });
    const [endpoint, setEndpoint]= useState<string>('')
    const [gatekeeperNetwork, setGatekeeperNetwork] = useState<anchor.web3.PublicKey>()
    const [isLoading, setIsLoading] = useState(true)

    const params = useParams()

    //const network = WalletAdapterNetwork.get;

    useEffect(() => {
        const url = new URL(window.location.href)

        setEndpoint(url.searchParams.get('network')!)

        setGatekeeperNetwork(new anchor.web3.PublicKey(url.searchParams.get('gkNetwork')!))

        setIsLoading(false)
    }, [])

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            //new SolletWalletAdapter({ endpoint }),
            //new SolletExtensionWalletAdapter({ endpoint }),
        ],
        []
    );

    return (
        <div className="container">
            {!isLoading && (
                <ConnectionProvider endpoint={endpoint}>
                    <WalletProvider wallets={wallets}>
                        <WalletModalProvider>
                            <WalletConnectButton disabled={isLoading} className="connect-btn mt-3"/>
                            {gatekeeperNetwork && (
                                <BotChallenge gatekeeperNetwork={gatekeeperNetwork} endpoint={endpoint}/>
                            )}
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            )}
        </div>
    )
}