import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/cart_reducer';
import {
	ADD_TO_CART,
	REMOVE_CART_ITEM,
	TOGGLE_CART_ITEM_AMOUNT,
	CLEAR_CART,
	COUNT_CART_TOTALS,
} from '../actions';

function getLocalStorage() {
	let cart = localStorage.getItem('cart');
	return cart ? JSON.parse(cart) : [];
}

const initialState = {
	cart: getLocalStorage(),
	total_items: 0,
	total_amount: 0,
	shipping_fee: 534,
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	function addToCart(id, color, amount, product) {
		dispatch({ type: ADD_TO_CART, payload: { id, color, amount, product } });
	}

	function removeItem(id) {
		dispatch({ type: REMOVE_CART_ITEM, payload: id });
	}

	function clearCart() {
		dispatch({ type: CLEAR_CART });
	}

	function toggleAmount(id, value) {
		dispatch({ type: TOGGLE_CART_ITEM_AMOUNT, payload: { identifier: id, value } });
	}

	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(state.cart));
		dispatch({ type: COUNT_CART_TOTALS });
	}, [state.cart]);

	return (
		<CartContext.Provider
			value={{
				...state,
				addToCart,
				removeItem,
				clearCart,
				toggleAmount,
			}}>
			{children}
		</CartContext.Provider>
	);
};

export const useCartContext = () => {
	return useContext(CartContext);
};
