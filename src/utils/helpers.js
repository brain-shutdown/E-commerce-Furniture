export const formatPrice = (price) => {
	const formattedPrice = Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR',
	}).format(price / 100);
	return formattedPrice;
};

export const getUniqueValues = () => {};
