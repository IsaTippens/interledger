import { createAuthenticatedClient, createUnauthenticatedClient } from '@interledger/open-payments';
import readline from "readline/promises";
import * as fs from 'fs';

const sender = "https://ilp.rafiki.money/allowance";
const sender_keyid = "8c6e3fdc-7df7-493e-8106-9f5f681d33a3";
const sender_private_key =  fs.readFileSync('C:/Users/bmawh/Downloads/private.key', 'utf8');



const reciever = "https://ilp.rafiki.money/mmm";

async function main() {
    const client = await createUnauthenticatedClient({});
    const paymentPointer = reciever;
    const recieverWalletAddress = await client.walletAddress.get({
        url: paymentPointer
    });

    console.log(recieverWalletAddress);
    const senderWalletAddress = await client.walletAddress.get({
        url: sender
    });
    console.log(senderWalletAddress);



    const authClient = await createAuthenticatedClient({
        keyId: sender_keyid,
        privateKey: sender_private_key,
        walletAddressUrl: sender
    })

    let senderKeys = await authClient.walletAddress.getKeys({
        url: sender
    });

    // not really needed
    console.log(senderKeys);

    const grant: any = await authClient.grant.request(
        {
            url: recieverWalletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        type: "incoming-payment",
                        actions: ["read", "complete", "create"],
                    },
                ],
            },
        },
    );

    console.log(grant);

    const incomingPayment = await authClient.incomingPayment.create(
        {
            url: recieverWalletAddress.resourceServer,
            accessToken: grant.access_token.value,
        },
        {
            walletAddress: reciever,
            incomingAmount: {
                value: "50000",
                assetCode: "JPY",
                assetScale: 2,
            },
        },
    );

    console.log({ incomingPayment });

    const quoteGrant: any = await authClient.grant.request(
        {
            url: senderWalletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        type: "quote",
                        actions: ["create", "read"],
                    },
                ],
            },
        },
    );

    console.log({ quoteGrant });

    const quote = await authClient.quote.create(
        {
            url: senderWalletAddress.resourceServer,
            accessToken: quoteGrant.access_token.value,
        },
        {
            method: "ilp",
            walletAddress: sender,
            receiver: incomingPayment.id,
        },
    );

    console.log({ quote });

    const outgoingGrantInteract = await authClient.grant.request(
        {
            url: senderWalletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        identifier: senderWalletAddress.id,
                        type: "outgoing-payment",
                        actions: ["read", "create"],
                        limits: {
                            debitAmount: {
                                assetCode: quote.debitAmount.assetCode,
                                assetScale: quote.debitAmount.assetScale,
                                value: quote.debitAmount.value,
                              },
                        },
                    },
                ],
            },
            interact: {
                start: ["redirect"],
            },
        },
    );

    console.log({ outgoingGrantInteract });




    await readline
        .createInterface({ input: process.stdin, output: process.stdout })
        .question("\nPlease accept grant and press enter...");

    let finalizedOutgoingPaymentGrant: any;
    try {
        finalizedOutgoingPaymentGrant = await authClient.grant.continue({
            url: outgoingGrantInteract.continue.uri,
            accessToken: outgoingGrantInteract.continue.access_token.value,
        });
    } catch (err) {
        console.log(err);
        process.exit();
    }

    console.log({ finalizedOutgoingPaymentGrant });

    
    const outgoingPayment = await authClient.outgoingPayment.create(
        {
          url: senderWalletAddress.resourceServer,
          accessToken: finalizedOutgoingPaymentGrant.access_token.value,
        },
        {
          walletAddress: sender,
          quoteId: quote.id,
        },
      );
      
    
}





    main().then(() => { });