import { createAuthenticatedClient, isPendingGrant, } from '@interledger/open-payments';
import * as fs from 'fs';

async function main() {
    const privateKey = fs.readFileSync('C:/Users/bmawh/Downloads/private.key', 'utf8');
  const client = await createAuthenticatedClient({
    walletAddressUrl: "https://ilp.rafiki.money/allowance",
    privateKey: privateKey,
    keyId: "8c6e3fdc-7df7-493e-8106-9f5f681d33a3",
  });

  const walletAddress_client = await client.walletAddress.get({
    url: 'https://ilp.rafiki.money/allowance'
  });

  const walletAddress_Service = await client.walletAddress.get({
    url: "https://ilp.rafiki.money/mmm"
  });


  /*const incomingPayment = await client.walletAddress.get({
    url: 'https://ilp.rafiki.money/allowance/3b8e2693-d297-41c9-bbb5-e9e31e17b9da'
  });*/


  console.log(walletAddress_client);
  //console.log(incomingPayment);

  /*

  //Request Quote Grant

  const grant = await client.grant.request(
    {
      url: walletAddress_client.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create", "read", "read-all"],
          },
        ],
      },
    },
  );

  if (isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

console.log("QUOTE_ACCESS_TOKEN =", grant.access_token.value);
console.log("QUOTE_ACCESS_TOKEN_MANAGE_URL = ", grant.access_token.manage);

const grants = await client.grant.continue(
    {
      accessToken: grant.access_token.value,
      url: grant.access_token.manage,
    },
    {
      interact_ref: interactRef,
    },
  );*/


  const incomingPaymentGrant = await client.grant.request(
    { url: walletAddress_Service.authServer },
    {
      access_token: {
        access: [
          {
            type: 'incoming-payment',
            actions: ['read-all', 'create']
          }
        ]
      }
    }
  )



  const incomingPayment = await client.incomingPayment.create(
    {
      url: new URL(walletAddress_Service.id).origin,
      accessToken: incomingPaymentGrant.access_token.value
    },
    {
      walletAddress: walletAddress_Service.id,
      incomingAmount: {
        assetCode: 'USD',
        assetScale: 2,
        value: '5000'
      },
      metadata: {
        externalRef: '#INV2022-8363828',
        description: 'Gardening'
      }
    }
  )
}






main().catch(err => {
  console.error(err);
}).then();
