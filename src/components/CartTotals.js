import React from 'react';
import styled from 'styled-components';
import { useCartContext } from '../context/cart_context';
import { useAuth0 } from '@auth0/auth0-react';
import { formatPrice } from '../utils/helpers';
import { Link } from 'react-router-dom';

const CartTotals = () => {
	const { shipping_fee, total_amount } = useCartContext();
	const { isAuthenticated, loginWithRedirect } = useAuth0();
	return (
		<Wrapper>
			<div>
				<article>
					<h5>
						Subtotal : <span>{formatPrice(total_amount)}</span>
					</h5>
					<p>
						Shipping Fee : <span>{formatPrice(shipping_fee)}</span>
					</p>
					<hr />
					<h4>
						Order Total : <span>{formatPrice(shipping_fee + total_amount)}</span>
					</h4>
				</article>
				{isAuthenticated ? (
					<Link to='/checkout' className='btn'>
						Proceed to checkout
					</Link>
				) : (
					<button className='btn' onClick={loginWithRedirect}>
						Login
					</button>
				)}
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.section`
	margin-top: 3rem;
	display: flex;
	justify-content: center;
	article {
		border: 1px solid var(--clr-grey-8);
		border-radius: var(--radius);
		padding: 1.5rem 3rem;
	}
	h4,
	h5,
	p {
		display: grid;
		grid-template-columns: 200px 1fr;
	}
	p {
		text-transform: capitalize;
	}
	h4 {
		margin-top: 2rem;
	}
	@media (min-width: 776px) {
		justify-content: flex-end;
	}
	.btn {
		width: 100%;
		margin-top: 1rem;
		text-align: center;
		font-weight: 700;
	}
`;

export default CartTotals;
