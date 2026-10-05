<script>
	import Button from './Button.svelte';
	import { cart, isCartOpen } from '../stores/cart.js';
	import { wishlist } from '../stores/wishlist.js';
	import { Heart } from 'lucide-svelte';

	// Use let instead of default object
	let {
		product = {
			id: Math.random().toString(36).substr(2, 9),
			name: 'Product',
			price: 0,
			image: '',
			description: ''
		}
	} = $props();

	let count = $state(1);
	let wishlistItems = $state([]);

	$effect(() => {
		wishlist.subscribe((items) => {
			wishlistItems = items;
		});
	});

	let isFavorite = $derived(wishlistItems.some((item) => String(item.id) === String(product.id)));

	function addToCart() {
		if (count > 0) {
			cart.addItem(product, count);
			isCartOpen.set(true);
			count = 1; // Reset count after adding
		}
	}

	function toggleWishlist(e) {
		e.preventDefault();
		e.stopPropagation();
		wishlist.toggleItem(product);
	}
</script>

<div>
	<a href={`/product/${product.id}`} class="card-link">
		<div class="product-card">
			<div class="top-card">
				<button
					type="button"
					class="wishlist-btn"
					class:favorited={isFavorite}
					onclick={toggleWishlist}
					aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
					title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
				>
					<Heart
						size={18}
						fill={isFavorite ? '#ff4757' : 'none'}
						color={isFavorite ? '#ff4757' : '#555555'}
						strokeWidth={2.2}
					/>
				</button>
				{#if product.image}
					<img src={product.image} alt={product.name} />
				{:else}
					<div class="placeholder">No Image</div>
				{/if}
			</div>
			<div class="bottom-card">
				<h3>{product.name}</h3>
				<p class="price">${product.price.toFixed(2)}</p>
				<p class="description">{product.description}</p>
			</div>
		</div>
	</a>
	<div class="quantity-buy">
		<div class="change-quantity">
			<button class="decrement" onclick={() => count > 1 && count--}>-</button>
			<p class="item-count">{count}</p>
			<button class="increment" onclick={() => count++}>+</button>
		</div>
		<button class="add-cart-btn" onclick={addToCart}>Add to Cart</button>
	</div>
</div>

<style>
	.card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		cursor: pointer;
	}

	.product-card {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.product-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.top-card {
		background-color: black;
		height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		position: relative;
	}

	button.wishlist-btn {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		padding: 0;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: transform 0.15s ease, background-color 0.2s ease;
		z-index: 2;
	}

	button.wishlist-btn:hover {
		transform: scale(1.1);
		background-color: #ffffff;
	}

	.top-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		color: #999;
	}

	.bottom-card {
		background-color: grey;
		padding: 1rem;
		color: white;
		width: 100%;
		box-sizing: border-box;
	}

	.bottom-card h3 {
		margin: 0 0 8px 0;
		font-size: 1.1rem;
	}

	.price {
		font-weight: bold;
		font-size: 1.2rem;
		margin: 8px 0;
	}

	.description {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.9;
	}

	button {
		background-color: orangered;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 8px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover {
		background-color: #ff4500;
	}

	.increment,
	.decrement {
		border-radius: 50%;
		width: 32px;
		height: 32px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		font-weight: bold;
	}

	.quantity-buy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 10px;
	}

	.change-quantity {
		display: flex;
		flex-direction: row;
		gap: 12px;
		align-items: center;
	}

	.item-count {
		margin: 0;
		font-weight: 600;
		min-width: 30px;
		text-align: center;
	}

	.add-cart-btn {
		width: 100%;
		padding: 12px;
		font-weight: 600;
		font-size: 1rem;
	}
</style>
