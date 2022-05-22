import {
	LOAD_PRODUCTS,
	SET_LISTVIEW,
	SET_GRIDVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from '../actions';

const filter_reducer = (state, action) => {
	switch (action.type) {
		case LOAD_PRODUCTS:
			let max_price = action.payload.map((product) => product.price);
			max_price = Math.max(...max_price);
			return {
				...state,
				all_products: [...action.payload], //Create a copy of products to prevent conflicts with filtered products
				filtered_products: [...action.payload],
				filters: { ...state.filters, max_price, price: max_price },
			};
		case SET_LISTVIEW:
			return {
				...state,
				grid_view: false,
			};
		case SET_GRIDVIEW:
			return {
				...state,
				grid_view: true,
			};
		case UPDATE_SORT:
			return {
				...state,
				sort: action.payload,
			};
		case SORT_PRODUCTS:
			let sorted;
			if (state.sort.includes('name')) {
				sorted = state.filtered_products.sort((a, b) => a.name.localeCompare(b.name));
				if (state.sort.includes('-z')) {
					sorted.reverse();
				}
			} else if (state.sort.includes('price')) {
				sorted = state.filtered_products.sort((a, b) => b.price - a.price);
				if (state.sort.includes('lowest')) {
					sorted.reverse();
				}
			}
			return {
				...state,
				filtered_products: sorted,
			};
		case UPDATE_FILTERS:
			const { name, value } = action.payload;
			return {
				...state,
				filters: {
					...state.filters,
					[name]: value,
				},
			};
		case FILTER_PRODUCTS:
			const filtered_products = filterProducts(state);

			return {
				...state,
				filtered_products,
			};
		case CLEAR_FILTERS:
			return {
				...state,
				filters: {
					...state.filters,
					text: '',
					debouncedText: '',
					category: 'all',
					company: 'all',
					color: 'all',
					price: state.filters.max_price,
					shipping: false,
				},
			};
		default:
			throw new Error(`No Matching "${action.type}" - action type`);
	}
};

function filterProducts(state) {
	const { all_products } = state;
	const { debouncedText, category, company, color, price, shipping } = state.filters;

	let filteredProducts = [...all_products];

	if (debouncedText) {
		filteredProducts = filteredProducts.filter((product) => {
			return product.name.toLowerCase().includes(debouncedText);
		});
	}
	if (category !== 'all') {
		filteredProducts = filteredProducts.filter((product) => {
			return product.category === category;
		});
	}
	if (company !== 'all') {
		filteredProducts = filteredProducts.filter((product) => {
			return product.company === company;
		});
	}
	if (color !== 'all') {
		filteredProducts = filteredProducts.filter((product) => {
			return product.colors.includes(color);
		});
	}
	if (price < state.filters.max_price) {
		filteredProducts = filteredProducts.filter((product) => {
			return product.price <= price;
		});
	}
	if (shipping) {
		filteredProducts = filteredProducts.filter((product) => {
			return product.shipping;
		});
	}

	return filteredProducts;
}

export default filter_reducer;
