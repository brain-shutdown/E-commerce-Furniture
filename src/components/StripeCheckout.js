import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement, useStripe, Elements, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCartContext } from '../context/cart_context';
import { useAuth0 } from '@auth0/auth0-react';
import { formatPrice } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutForm() {
	const { clearCart, total_amount, shipping_fee } = useCartContext();
	const { user } = useAuth0();

	const stripe = useStripe();
	const elements = useElements();

	let navigate = useNavigate();
	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [succeeded, setSucceeded] = useState(false);

	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get(
			'payment_intent_client_secret'
		);

		if (!clientSecret) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case 'succeeded':
					setMessage('Payment succeeded!');
					break;
				case 'processing':
					setMessage('Your payment is processing.');
					break;
				case 'requires_payment_method':
					setMessage('Your payment was not successful, please try again.');
					break;
				default:
					setMessage('Something went wrong.');
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) {
			return;
		}
		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			redirect: 'if_required',
			// confirmParams: {
			// 	// Make sure to change this to your payment completion page
			// 	return_url: 'http://localhost:8888',
			// },
		});

		if (error) {
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message);
			} else {
				setMessage('An unexpected error occured.');
			}
		} else {
			setSucceeded(true);
			setTimeout(() => {
				clearCart();
				navigate('/', { replace: true });
			}, 5000);
		}

		setIsLoading(false);
	};

	return (
		<div>
			{succeeded ? (
				<article>
					<h3>Thank you!</h3>
					<h4>Your payment was successful!</h4>
					<h5>Redirecting to home page shortly</h5>
				</article>
			) : (
				<article>
					<h4>Hello, {user && user.name}!</h4>
					<p>Your total is {formatPrice(total_amount + shipping_fee)}</p>
				</article>
			)}
			<form id='payment-form' onSubmit={handleSubmit}>
				<PaymentElement id='payment-element' />
				<button disabled={isLoading || !stripe || !elements} id='submit'>
					<span id='button-text'>
						{isLoading ? <div className='spinner' id='spinner'></div> : 'Pay now'}
					</span>
				</button>
				{/* Show any error or success messages */}
				{message && <div id='payment-message'>{message}</div>}
				{/* Show a success message upon completion */}
				<p className={succeeded ? 'result-message' : 'result-message hidden'}>
					Payment succeeded, see the result in your
					<a href={`https://dashboard.stripe.com/test/payments`}>
						{' '}
						Stripe dashboard.
					</a>{' '}
					Refresh the page to pay again.
				</p>
			</form>
		</div>
	);
}

const StripeCheckout = () => {
	const [clientSecret, setClientSecret] = useState('');
	const { cart, total_amount, shipping_fee } = useCartContext();

	useEffect(() => {
		const createPaymentIntent = async () => {
			try {
				const { data } = await axios.post(
					'/.netlify/functions/create-payment-intent',
					JSON.stringify({ cart, shipping_fee, total_amount })
				);

				setClientSecret(data.clientSecret);
			} catch (error) {
				// console.log(error.message);
			}
		};
		createPaymentIntent();
	}, []);

	const appearance = {
		theme: 'stripe',
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<Wrapper>
			{clientSecret && (
				<Elements options={options} stripe={promise}>
					<CheckoutForm />
				</Elements>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.section`
	padding: 2rem;
	form {
		width: 30vw;
		min-width: 500px;
		align-self: center;
		box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1), 0px 2px 5px 0px rgba(50, 50, 93, 0.1),
			0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
		border-radius: 7px;
		padding: 40px;
	}

	#payment-message {
		color: rgb(105, 115, 134);
		font-size: 16px;
		line-height: 20px;
		padding-top: 12px;
		text-align: center;
	}

	#payment-element {
		margin-bottom: 24px;
	}

	.result-message {
		line-height: 22px;
		font-size: 16px;
	}
	.result-message a {
		color: rgb(89, 111, 214);
		font-weight: 600;
		text-decoration: none;
	}
	.hidden {
		display: none;
	}

	/* Buttons and links */
	button {
		background: #5469d4;
		font-family: Arial, sans-serif;
		color: #ffffff;
		border-radius: 4px;
		border: 0;
		padding: 12px 16px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		display: block;
		transition: all 0.2s ease;
		box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
		width: 100%;
	}

	button:hover {
		filter: contrast(115%);
	}

	button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	/* spinner/processing state, errors */
	.spinner,
	.spinner:before,
	.spinner:after {
		border-radius: 50%;
	}

	.spinner {
		color: #ffffff;
		font-size: 22px;
		text-indent: -99999px;
		margin: 0px auto;
		position: relative;
		width: 20px;
		height: 20px;
		box-shadow: inset 0 0 0 2px;
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
	}

	.spinner:before,
	.spinner:after {
		position: absolute;
		content: '';
	}

	.spinner:before {
		width: 10.4px;
		height: 20.4px;
		background: #5469d4;
		border-radius: 20.4px 0 0 20.4px;
		top: -0.2px;
		left: -0.2px;
		-webkit-transform-origin: 10.4px 10.2px;
		transform-origin: 10.4px 10.2px;
		-webkit-animation: loading 2s infinite ease 1.5s;
		animation: loading 2s infinite ease 1.5s;
	}

	.spinner:after {
		width: 10.4px;
		height: 10.2px;
		background: #5469d4;
		border-radius: 0 10.2px 10.2px 0;
		top: -0.1px;
		left: 10.2px;
		-webkit-transform-origin: 0px 10.2px;
		transform-origin: 0px 10.2px;
		-webkit-animation: loading 2s infinite ease;
		animation: loading 2s infinite ease;
	}

	@keyframes loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@media only screen and (max-width: 600px) {
		form {
			width: 80vw;
			min-width: initial;
		}
	}
`;

export default StripeCheckout;
