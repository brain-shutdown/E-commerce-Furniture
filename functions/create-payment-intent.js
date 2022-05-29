require('dotenv').config();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
	if (event.body) {
		const { cart, shipping_fee, total_amount } = JSON.parse(event.body);

		const calculateOrderAmount = () => {
			return shipping_fee + total_amount;
		};

		try {
			// Create a PaymentIntent with the order amount and currency
			const paymentIntent = await stripe.paymentIntents.create({
				amount: calculateOrderAmount(),
				currency: 'eur',
				// automatic_payment_methods: {
				// 	enabled: true,
				// },
			});

			return {
				statusCode: 200,
				body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
			};
		} catch (error) {
			return {
				statusCode: 500,
				body: JSON.stringify({ error: error.message }),
			};
		}
	} else {
		return {
			statusCode: 200,
			body: 'Create Payment Intent',
		};
	}
};
