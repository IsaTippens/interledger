import { createAuthenticatedClient, createUnauthenticatedClient, WalletAddress, AuthenticatedClient, UnauthenticatedClient, Grant, Quote, IncomingPaymentWithPaymentMethods, PendingGrant, OutgoingPaymentWithSpentAmounts} from '@interledger/open-payments';

async function getWalletInfo(url: string) : Promise<WalletAddress> {
    const client = await createUnauthenticatedClient({});
    const walletAddress = await client.walletAddress.get({
        url: url
    });
    return walletAddress;
}

async function getIncomingPaymentGrant(authClient: AuthenticatedClient, receiverWalletAddress: WalletAddress) : Promise<Grant> {
    const grant: any = await authClient.grant.request(
        {
            url: receiverWalletAddress.authServer,
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
    return grant;
}

export interface IncomingPaymentArgs {
    receiverWalletAddress: WalletAddress;
    grant: Grant;
    amount: string;
    assetCode: string;
    assetScale: number;
}

async function createIncomingPayment(authClient: AuthenticatedClient, args: IncomingPaymentArgs) : Promise<IncomingPaymentWithPaymentMethods> {
    let { grant, receiverWalletAddress } = args;
    const incomingPayment = await authClient.incomingPayment.create(
        {
            url: receiverWalletAddress.resourceServer,
            accessToken: grant.access_token.value,
        },
        {
            walletAddress: receiverWalletAddress.id,
            incomingAmount: {
                value: args.amount,
                assetCode: args.assetCode,
                assetScale: args.assetScale,
            },
        },
    );
    return incomingPayment;
}

async function getQuoteGrant(authClient: AuthenticatedClient, senderWalletAddress: WalletAddress): Promise<Grant> {
    const grant: any = await authClient.grant.request(
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
    return grant;
}

export interface QuoteArgs {
    senderWalletAddress: WalletAddress;
    quoteGrant: Grant;
    incomingPaymentId: string;
}

async function createQuote(authClient: AuthenticatedClient, args: QuoteArgs): Promise<Quote> {
    let { quoteGrant, senderWalletAddress } = args;
    const quote = await authClient.quote.create(
        {
            url: senderWalletAddress.resourceServer,
            accessToken: quoteGrant.access_token.value,
        },
        {
            method: "ilp",
            walletAddress: senderWalletAddress.id,
            receiver: args.incomingPaymentId,
        },
    );
    return quote;
}

export interface OutgoingPaymentGrantArgs {
    senderWalletAddress: WalletAddress;
    quote: Quote;
}

async function getOutgoingPaymentGrant(authClient: AuthenticatedClient, args: OutgoingPaymentGrantArgs) : Promise<PendingGrant> {
    let {quote, senderWalletAddress} = args;
    
    const grant = await authClient.grant.request(
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
    return grant as PendingGrant;
}

export interface FinaliseOutgoingPaymentGrant {
    continueUri: string;
    continueAccessToken: string;
}

async function finaliseOutgoingPaymentGrant(authClient: AuthenticatedClient, args: FinaliseOutgoingPaymentGrant) : Promise<Grant | undefined> {
    let finalizedOutgoingPaymentGrant;
    try {
        finalizedOutgoingPaymentGrant = await authClient.grant.continue({
            url: args.continueUri,
            accessToken: args.continueAccessToken,
        });
    } catch (err) {
        console.error(err);
        return undefined;
    }

    return finalizedOutgoingPaymentGrant as Grant;
}

export interface OutgoingPaymentArgs {
    senderWalletAddress: WalletAddress;
    access_token: string;
    quote: Quote;
}

async function createOutgoingPayment(authClient: AuthenticatedClient, args: OutgoingPaymentArgs) : Promise<OutgoingPaymentWithSpentAmounts> {
    let { quote, senderWalletAddress, access_token } = args;
    const outgoingPayment = await authClient.outgoingPayment.create(
        {
            url: senderWalletAddress.resourceServer,
            accessToken: access_token,
        },
        {
            walletAddress: senderWalletAddress.id,
            quoteId: quote.id,
        },
    );
    return outgoingPayment;
}