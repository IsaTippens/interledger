import {getWalletInfo, getIncomingPaymentGrant, createIncomingPayment, getQuoteGrant, createQuote, getOutgoingPaymentGrant, finaliseOutgoingPaymentGrant, createOutgoingPayment} from '../backend/openpayments/helper';
import {createAuthenticatedClient} from '@interledger/open-payments';
import readline from "readline/promises";

const sender_payment_url = "https://ilp.interledger-test.dev/isapay";
const sender_keyid = "087f7a8e-230a-4ebc-8f6b-9bfab114cfa3";
const sender_private_key = "C:/Users/isati/Downloads/testusd.key";

const receiver_payment_url = "https://ilp.interledger-test.dev/isapay2";


async function main() {
    let sender_walletAddress = await getWalletInfo(sender_payment_url);
    let receiver_walletAddress = await getWalletInfo(receiver_payment_url);

    let client = await createAuthenticatedClient({
        keyId: sender_keyid,
        privateKey: sender_private_key,
        walletAddressUrl: sender_payment_url
    });

    let grant = await getIncomingPaymentGrant(client, receiver_walletAddress);

    let incomingPayment = await createIncomingPayment(client, {
        receiverWalletAddress: receiver_walletAddress,
        grant: grant,
        amount: "1000",
        assetCode: "USD",
        assetScale: 2
    });

    let quoteGrant = await getQuoteGrant(client, sender_walletAddress);

    let quote = await createQuote(client, {
        senderWalletAddress: sender_walletAddress,
        quoteGrant: quoteGrant,
        incomingPaymentId: incomingPayment.id
    });

    let outgoingPaymentGrant = await getOutgoingPaymentGrant(client, {
        senderWalletAddress: sender_walletAddress,
        quote: quote
    });

    console.log({outgoingPaymentGrant});

    await readline
    .createInterface({ input: process.stdin, output: process.stdout })
    .question("\nPlease accept grant and press enter...");

    let finalizedOutgoingPaymentGrant = await finaliseOutgoingPaymentGrant(client, {
        continueUri: outgoingPaymentGrant.continue.uri,
        continueAccessToken: outgoingPaymentGrant.continue.access_token.value
    });

    if (!finalizedOutgoingPaymentGrant) {
        throw new Error("Failed to finalize outgoing payment grant");
    }

    let outgoingPayment = await createOutgoingPayment(client, {
        senderWalletAddress: sender_walletAddress,
        access_token: finalizedOutgoingPaymentGrant.access_token.value,
        quote: quote
    });
}

main().then(() => {});