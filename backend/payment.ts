import { createAuthenticatedClient, createUnauthenticatedClient } from '@interledger/open-payments';
import readline from "readline/promises";

const isa = "";
const isa_keyid = "";
const isa_private_key = "";


const ruchelle = "";

async function main() {
    const client = await createUnauthenticatedClient({});
    const paymentPointer = ruchelle;
    const ruchelleWalletAddress = await client.walletAddress.get({
        url: paymentPointer
    });

    console.log(ruchelleWalletAddress);
    const isaWalletAddress = await client.walletAddress.get({
        url: isa
    });
    console.log(isaWalletAddress);



    const authClient = await createAuthenticatedClient({
        keyId: isa_keyid,
        privateKey: isa_private_key,
        walletAddressUrl: isa
    })

    let isaKeys = await authClient.walletAddress.getKeys({
        url: isa
    });

    // not really needed
    console.log(isaKeys);

    const grant: any = await authClient.grant.request(
        {
            url: ruchelleWalletAddress.authServer,
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
            url: ruchelleWalletAddress.resourceServer,
            accessToken: grant.access_token.value,
        },
        {
            walletAddress: ruchelle,
            incomingAmount: {
                value: "1000",
                assetCode: "USD",
                assetScale: 2,
            },
        },
    );

    console.log({ incomingPayment });

    const quoteGrant: any = await authClient.grant.request(
        {
            url: isaWalletAddress.authServer,
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
            url: isaWalletAddress.resourceServer,
            accessToken: quoteGrant.access_token.value,
        },
        {
            method: "ilp",
            walletAddress: isa,
            receiver: incomingPayment.id,
        },
    );

    console.log({ quote });

    const outgoingGrantInteract = await authClient.grant.request(
        {
            url: isaWalletAddress.authServer,
        },
        {
            access_token: {
                access: [
                    {
                        identifier: isaWalletAddress.id,
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
          url: isaWalletAddress.resourceServer,
          accessToken: finalizedOutgoingPaymentGrant.access_token.value,
        },
        {
          walletAddress: isa,
          quoteId: quote.id,
        },
      );
      
    
}





    main().then(() => { });