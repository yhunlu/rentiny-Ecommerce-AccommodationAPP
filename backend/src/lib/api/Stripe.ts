import stripe from 'stripe';

//grepper typescript initialize stripe connection
const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});
//end grepper

//grepper typescript connect stripe with OAuth and direct apply charge
export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: 'usd',
        source,
        application_fee_amount: (amount * 0.05),
      },
      {
        stripeAccount,
      }
    );

    if (res.status !== 'succeeded') {
      throw new Error('failed to create charge with Stripe');
    }
  },
};
//end grepper
