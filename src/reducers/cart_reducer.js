import {
	ADD_TO_CART,
	CLEAR_CART,
	COUNT_CART_TOTALS,
	REMOVE_CART_ITEM,
	TOGGLE_CART_ITEM_AMOUNT,
} from '../actions';

const cart_reducer = (state, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const { id, amount, color, product } = action.payload;
			const item = state.cart.find((i) => i.id === id + color);

			if (item) {
				const tempCart = state.cart.map((cartItem) => {
					if (cartItem.id === item.id) {
						let newAmount = cartItem.amount + amount;
						if (newAmount > cartItem.max) {
							newAmount = cartItem.max;
						}
						return { ...cartItem, amount: newAmount };
					}
					return cartItem;
				});
				return { ...state, cart: tempCart };
			} else {
				const newItem = {
					id: id + color,
					name: product.name,
					color,
					amount,
					image: product.images[0].url,
					price: product.price,
					max: product.stock,
				};
				return { ...state, cart: [...state.cart, newItem] };
			}
		case CLEAR_CART:
			return {
				...state,
				cart: [],
			};
		case COUNT_CART_TOTALS:
			let { total_items, total_amount } = state.cart.reduce(
				(total, cartItem) => {
					const { amount, price } = cartItem;

					total.total_items += amount;
					total.total_amount += amount * price;
					return total;
				},
				{
					total_amount: 0,
					total_items: 0,
				}
			);

			return {
				...state,
				total_items,
				total_amount,
			};
		case REMOVE_CART_ITEM:
			const itemToRemove = action.payload;

			return {
				...state,
				cart: state.cart.filter((item) => item.id !== itemToRemove),
			};
		case TOGGLE_CART_ITEM_AMOUNT:
			const { identifier, value } = action.payload;

			const newCart = state.cart.map((cartItem) => {
				if (cartItem.id === identifier) {
					let newAmount;
					if (value === 'inc') {
						newAmount = cartItem.amount + 1;
						if (newAmount > cartItem.max) {
							newAmount = cartItem.max;
						}
					}
					if (value === 'dec') {
						newAmount = cartItem.amount - 1;
						if (newAmount < 1) {
							newAmount = 1;
						}
					}

					return { ...cartItem, amount: newAmount };
				}
				return cartItem;
			});

			return { ...state, cart: newCart };
		default:
			throw new Error(`No Matching "${action.type}" - action type`);
	}
};

export default cart_reducer;
