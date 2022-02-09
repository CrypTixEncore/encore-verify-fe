import axios from "axios";
import * as anchor from '@project-serum/anchor'
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

async function getAllNftMetadata (publicKeyStr) {
    const connection = new anchor.web3.Connection(
        'https://solana-api.projectserum.com/',
        'confirmed',
    );

    const programIdStr = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

    const tokenAccounts = await axios.post('https://solana-api.projectserum.com/',
        {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenAccountsByOwner",
                "params": [
                    publicKeyStr,
                    {
                        "programId": programIdStr
                    },
                    {
                        "encoding": "jsonParsed"
                    }
                ]
            })

    const metadata_arr = [];

    for (const nft of tokenAccounts['data']['result']['value']) {

        const amount = nft.account.data.parsed.info.tokenAmount.amount
        const decimals = nft.account.data.parsed.info.tokenAmount.decimals

        if (amount === '1' && decimals === 0) {
            const tokenMint = nft.account.data.parsed.info.mint

            const ownedMetadata = await Metadata.load(connection, await Metadata.getPDA(tokenMint));
            const metadata = await axios.get(ownedMetadata.data.data.uri);

            metadata_arr.push(metadata.data)
        }
    }

    return metadata_arr
}

export {getAllNftMetadata}

