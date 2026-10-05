import { getProductById, products } from '$lib/products.js';
import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
	const product = getProductById(params.id);

	if (!product) {
		throw error(404, 'Product not found');
	}

	const relatedProducts = products.filter(
		(p) => p.category === product.category && String(p.id) !== String(product.id)
	);

	return {
		product,
		relatedProducts
	};
};
