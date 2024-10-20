import {Router} from 'express';

import {getWalletInfo, getIncomingPaymentGrant, createIncomingPayment, getQuoteGrant, createQuote, getOutgoingPaymentGrant, finaliseOutgoingPaymentGrant, createOutgoingPayment} from '../openpayments/helper';
import {AccessAction, createAuthenticatedClient} from '@interledger/open-payments';

const endpoint = "/payment";
const paymentRouter = Router();

// POST /payment/start
// Start the payment process
// Request body: { businessId: number, userWalletAddress: string }
// Response: { confirmationLink: string,  }

const sender_keyid = "";
const sender_private_key = "";

paymentRouter.post("/start", async (req, res) => {
    let { businessWalletAddress, userWalletAddress, amount } = req.body;

    let sender_payment_url = userWalletAddress;
    let receiver_payment_url = businessWalletAddress;

    if (typeof businessWalletAddress !== 'string' || typeof userWalletAddress !== 'string' || typeof amount !== 'number') {
        res.status(400).send('Invalid input');
        return;
    }

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

    let redirectUri = outgoingPaymentGrant.continue.uri;
    let access_token = outgoingPaymentGrant.continue.access_token.value;
    let continueUri = outgoingPaymentGrant.continue.uri;

    // IMPORTANT: send both of these back through the completion endpoint
    let continueData = {
        access_token: outgoingPaymentGrant.continue.access_token.value,
        uri: continueUri
    };

    let finalise = {
        quoteId: quote.id,
        sender_url : sender_payment_url,
    }

    // Send the redirect URI back to the client
    // The client will redirect the user to this URI to complete the payment
    // the client will also send the continueData back to the completion endpoint
    res.json({ redirectUri, continueData, finalise });
    
});


// POST /payment/complete
// Complete the payment process
// Request body: { businessId: number, userWalletAddress: string }
// Response: { message: string }

paymentRouter.post("/complete", async (req, res) => {
    let { continueData, finalise } = req.body;
    if (typeof continueData !== 'object' || typeof finalise !== 'object') {
        res.status(400).send('Invalid input');
        return;
    }

    let sender_payment_url = finalise.sender_url;

    let sender_walletAddress = await getWalletInfo(sender_payment_url);

    let client = await createAuthenticatedClient({
        keyId: sender_keyid,
        privateKey: sender_private_key,
        walletAddressUrl: sender_payment_url
    });

    let finalizedOutgoingPaymentGrant = await finaliseOutgoingPaymentGrant(client, {
        continueUri: continueData.uri,
        continueAccessToken: continueData.access_token
    });

    if (!finalizedOutgoingPaymentGrant) {
        throw new Error("Failed to finalize outgoing payment grant");
    }

    let outgoingPayment = await createOutgoingPayment(client, {
        senderWalletAddress: sender_walletAddress,
        access_token: finalizedOutgoingPaymentGrant.access_token.value,
        quote: finalise.quoteId
    });

});

export default paymentRouter;