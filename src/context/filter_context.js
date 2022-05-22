import React, { useEffect, useContext, useReducer, useState } from 'react';
import reducer from '../reducers/filter_reducer';
import {
	LOAD_PRODUCTS,
	SET_GRIDVIEW,
	SET_LISTVIEW,
	UPDATE_SORT,
	SORT_PRODUCTS,
	UPDATE_FILTERS,
	FILTER_PRODUCTS,
	CLEAR_FILTERS,
} from '../actions';
import { useProductsContext } from './products_context';

const initialState = {
	filtered_products: [],
	all_products: [],
	grid_view: true,
	sort: 'name-a',
	filters: {
		text: '',
		debouncedText: '',
		category: 'all',
		company: 'all',
		color: 'all',
		min_price: 0,
		max_price: 0,
		price: 0,
		shipping: false,
	},
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
	const { products } = useProductsContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [search, setSearch] = useState(state.filters.text);
	const debouncedSearch = useDebounce(search, 300);

	function setGridView() {
		dispatch({ type: SET_GRIDVIEW });
	}
	function setListView() {
		dispatch({ type: SET_LISTVIEW });
	}
	function updateSort(e) {
		const value = e.target.value;
		dispatch({ type: UPDATE_SORT, payload: value });
	}

	function updateFilters(e) {
		let name = e.target.name;
		let value = e.target.value;

		if (name === 'category') {
			value = e.target.textContent;
		}
		if (name === 'color') {
			value = e.target.dataset.color;
		}
		if (name === 'price') {
			value = Number(value);
		}
		if (name === 'shipping') {
			value = e.target.checked;
		}
		if (name === 'text') {
			setSearch(value);
		}
		dispatch({
			type: UPDATE_FILTERS,
			payload: { name, value },
		});
	}

	function clearFilters() {
		dispatch({ type: CLEAR_FILTERS });
	}

	useEffect(() => {
		dispatch({ type: FILTER_PRODUCTS });
		dispatch({ type: SORT_PRODUCTS });
	}, [state.filters, state.sort, products]);

	useEffect(() => {
		dispatch({ type: LOAD_PRODUCTS, payload: products });
	}, [products]);

	useEffect(() => {
		dispatch({
			type: UPDATE_FILTERS,
			payload: { name: 'debouncedText', value: debouncedSearch },
		});
	}, [debouncedSearch]);

	return (
		<FilterContext.Provider
			value={{
				...state,
				setGridView,
				setListView,
				updateSort,
				updateFilters,
				clearFilters,
			}}>
			{children}
		</FilterContext.Provider>
	);
};

function useDebounce(value, wait) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => setDebouncedValue(value), wait);
		return () => clearTimeout(id);
	}, [value, wait]);

	return debouncedValue;
}

export const useFilterContext = () => {
	return useContext(FilterContext);
};
