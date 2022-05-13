import stripe from 'stripe';

// grepper typescript initialize stripe connection
const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});
// end grepper

// grepper typescript connect stripe with OAuth
export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    return response;
  },
};
// end grepper
