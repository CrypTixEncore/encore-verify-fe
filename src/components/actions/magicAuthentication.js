import {Magic} from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";

const magicClient = new Magic('pk_live_90634A15C174EF41', {
    extensions: [
        new SolanaExtension({
            rpcUrl: "https://mainnet-beta.solana.com",
        }),
    ],
});

const authenticateUserWithSMS = async (phoneNumber) => {
    await magicClient.auth.loginWithSMS({phoneNumber});
 }

const authenticateUserWithEmail = async (email) => {
    await magicClient.auth.loginWithMagicLink({email});
}

const logoutMagic = async () => {
    await magicClient.user.logout();
 }

const getMetadata = async () => {
    const metadata = await magicClient.user.getMetadata();
    return metadata;
}

const isMagicLoggedIn = async () => {
    const isLoggedIn = await magicClient.user.isLoggedIn();
    return isLoggedIn;
}


export {isMagicLoggedIn, authenticateUserWithSMS, getMetadata, logoutMagic, authenticateUserWithEmail, magicClient}