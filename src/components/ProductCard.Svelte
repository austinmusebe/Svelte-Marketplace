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
		},
		showWishlist = true
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

<article class="product-card">
	<a href={`/product/${product.id}`} class="card-link">
		<div class="card-image-wrapper">
			{#if showWishlist}
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
						fill={isFavorite ? 'var(--color-destructive)' : 'none'}
						color={isFavorite ? 'var(--color-destructive)' : 'var(--text-subtle)'}
						strokeWidth={2.2}
					/>
				</button>
			{/if}
			{#if product.image}
				<img src={product.image} alt={product.name} />
			{:else}
				<div class="placeholder">No Image</div>
			{/if}
		</div>
		<div class="card-content">
			<div class="price">${product.price.toFixed(2)}</div>
			<h3 class="product-title">{product.name}</h3>
		</div>
	</a>
	<div class="card-actions">
		<button class="add-cart-btn" onclick={addToCart}>Add to Cart</button>
	</div>
</article>

<style>
	.product-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: var(--shadow-card);
		position: relative;
	}

	.product-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-card-hover);
		border-color: var(--border-strong);
	}

	.card-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.card-image-wrapper {
		background-color: var(--bg-subtle);
		aspect-ratio: 4 / 3;
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-bottom: 1px solid var(--border-subtle);
	}

	.card-image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		color: var(--text-subtle);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.wishlist-btn {
		position: absolute;
		top: 12px;
		right: 12px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-full);
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		cursor: pointer;
		box-shadow: var(--shadow-subtle);
		transition: transform 0.15s ease, background-color 0.2s ease, border-color 0.2s ease;
		z-index: 2;
	}

	.wishlist-btn:hover {
		transform: scale(1.05);
		border-color: var(--border-strong);
	}

	.card-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.price {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--text-contrast);
	}

	.product-title {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-muted);
		margin: 0;
		line-height: 1.4;
	}

	.card-actions {
		padding: 0 16px 16px 16px;
		margin-top: auto;
	}

	.add-cart-btn {
		width: 100%;
		background-color: var(--accent-primary);
		color: #ffffff;
		border: none;
		border-radius: var(--radius-md);
		padding: 10px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s, transform 0.1s ease;
	}

	.add-cart-btn:hover {
		background-color: var(--accent-hover);
	}

	.add-cart-btn:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}
</style>
