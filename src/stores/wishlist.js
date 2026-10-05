// Wishlist state & persistence
import { writable } from 'svelte/store';

function createWishlist() {
	const storedWishlist = typeof window !== 'undefined' ? localStorage.getItem('wishlist') : null;
	let initialWishlist = [];
	if (storedWishlist) {
		try {
			initialWishlist = JSON.parse(storedWishlist);
		} catch (e) {
			initialWishlist = [];
		}
	}

	const { subscribe, set, update } = writable(initialWishlist);

	function saveWishlist(items) {
		if (typeof window !== 'undefined') {
			localStorage.setItem('wishlist', JSON.stringify(items));
		}
	}

	return {
		subscribe,
		toggleItem: (product) => {
			update((items) => {
				const exists = items.some((item) => String(item.id) === String(product.id));
				let newItems;
				if (exists) {
					newItems = items.filter((item) => String(item.id) !== String(product.id));
				} else {
					newItems = [...items, product];
				}
				saveWishlist(newItems);
				return newItems;
			});
		},
		removeItem: (productId) => {
			update((items) => {
				const newItems = items.filter((item) => String(item.id) !== String(productId));
				saveWishlist(newItems);
				return newItems;
			});
		},
		clear: () => {
			saveWishlist([]);
			set([]);
		}
	};
}

export const wishlist = createWishlist();
