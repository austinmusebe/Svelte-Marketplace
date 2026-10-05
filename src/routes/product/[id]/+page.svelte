<script>
	import { cart, isCartOpen } from '../../../stores/cart.js';
	import { wishlist } from '../../../stores/wishlist.js';
	import { Heart } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let product = $derived(data.product);

	let count = $state(1);
	let selectedVariant = $state(product.variants?.[0] || '');
	let wishlistItems = $state([]);

	$effect(() => {
		wishlist.subscribe((items) => {
			wishlistItems = items;
		});
	});

	let isFavorite = $derived(wishlistItems.some((item) => String(item.id) === String(product.id)));

	function toggleWishlist() {
		wishlist.toggleItem(product);
	}

	$effect(() => {
		if (product.variants?.length) {
			selectedVariant = product.variants[0];
		}
		count = 1;
	});

	function addToCart() {
		if (count > 0) {
			const itemToAdd = {
				...product,
				name: selectedVariant ? `${product.name} (${selectedVariant})` : product.name
			};
			cart.addItem(itemToAdd, count);
			isCartOpen.set(true);
		}
	}

	function buyNow() {
		if (count > 0) {
			const itemToAdd = {
				...product,
				name: selectedVariant ? `${product.name} (${selectedVariant})` : product.name
			};
			cart.addItem(itemToAdd, count);
			goto('/checkout');
		}
	}
</script>

<div class="product-page-container">
	<div class="breadcrumbs">
		<a href="/home">Home</a>
		<span>/</span>
		<a href={`/home?category=${encodeURIComponent(product.category)}`}>{product.category}</a>
		<span>/</span>
		<span class="current-crumb">{product.name}</span>
	</div>

	<div class="product-detail-card">
		<div class="product-media">
			{#if product.image}
				<img src={product.image} alt={product.name} class="detail-image" />
			{:else}
				<div class="placeholder-large">No Image Available</div>
			{/if}
		</div>

		<div class="product-info">
			<div class="category-badge">{product.category}</div>
			<h1 class="product-title">{product.name}</h1>
			<p class="product-price">${product.price.toFixed(2)}</p>

			<div class="stock-status" class:low-stock={product.stock <= 5}>
				{#if product.stock > 5}
					<span class="stock-dot in-stock">●</span> In Stock ({product.stock} available)
				{:else if product.stock > 0}
					<span class="stock-dot low-stock">●</span> Low Stock (Only {product.stock} left!)
				{:else}
					<span class="stock-dot out-of-stock">●</span> Out of Stock
				{/if}
			</div>

			<p class="product-description">{product.description}</p>

			{#if product.variants && product.variants.length > 0}
				<div class="variant-section">
					<label for="variant-select">Options / Variant:</label>
					<div class="variant-options" id="variant-select">
						{#each product.variants as variant}
							<button
								type="button"
								class="variant-btn"
								class:selected={selectedVariant === variant}
								onclick={() => (selectedVariant = variant)}
							>
								{variant}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="purchase-controls">
				<div class="quantity-selector">
					<button
						type="button"
						class="qty-btn"
						onclick={() => count > 1 && count--}
						aria-label="Decrease quantity"
					>
						-
					</button>
					<span class="quantity-display">{count}</span>
					<button
						type="button"
						class="qty-btn"
						onclick={() => count < product.stock && count++}
						aria-label="Increase quantity"
					>
						+
					</button>
				</div>

				<button class="add-to-cart-btn" onclick={addToCart}>
					Add to Cart
				</button>
				<button class="buy-now-btn" onclick={buyNow}>
					Buy Now
				</button>
				<button
					type="button"
					class="wishlist-btn"
					class:active={isFavorite}
					onclick={toggleWishlist}
					aria-label={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
				>
					<Heart
						size={18}
						fill={isFavorite ? '#ff4757' : 'none'}
						color={isFavorite ? '#ff4757' : '#555555'}
						strokeWidth={2.2}
					/>
					<span>{isFavorite ? 'Wishlisted' : 'Wishlist'}</span>
				</button>
			</div>

			<div class="details-footer">
				<a href="/home" class="back-link">← Back to All Products</a>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.product-page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
		min-height: 80vh;
	}

	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 24px;
		font-size: 0.95rem;
		color: #666;
	}

	.breadcrumbs a {
		color: #ff6b6b;
		text-decoration: none;
		font-weight: 500;
	}

	.breadcrumbs a:hover {
		text-decoration: underline;
	}

	.current-crumb {
		color: #1a1a1a;
		font-weight: 600;
	}

	.product-detail-card {
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
		padding: 40px;
		overflow: hidden;
	}

	.product-media {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #1a1a1a;
		border-radius: 12px;
		min-height: 400px;
		overflow: hidden;
	}

	.detail-image {
		width: 100%;
		max-height: 500px;
		object-fit: cover;
	}

	.placeholder-large {
		color: #999;
		font-size: 1.2rem;
		text-align: center;
		padding: 40px;
	}

	.product-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.category-badge {
		display: inline-block;
		align-self: flex-start;
		background-color: #f0f0f0;
		color: #555;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 12px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.product-title {
		margin: 0 0 12px 0;
		font-size: 2.2rem;
		color: #1a1a1a;
		font-weight: 700;
	}

	.product-price {
		font-size: 2rem;
		color: #ff6b6b;
		font-weight: 800;
		margin: 0 0 16px 0;
	}

	.stock-status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.95rem;
		font-weight: 600;
		color: #27ae60;
		margin-bottom: 20px;
	}

	.stock-status.low-stock {
		color: #e67e22;
	}

	.stock-dot {
		font-size: 0.9rem;
	}

	.stock-dot.in-stock {
		color: #27ae60;
	}

	.stock-dot.low-stock {
		color: #e67e22;
	}

	.product-description {
		font-size: 1.05rem;
		line-height: 1.6;
		color: #555;
		margin: 0 0 28px 0;
	}

	.variant-section {
		margin-bottom: 28px;
	}

	.variant-section label {
		display: block;
		font-size: 0.9rem;
		font-weight: 600;
		color: #333;
		margin-bottom: 10px;
	}

	.variant-options {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.variant-btn {
		background-color: #f8f8f8;
		border: 2px solid #e0e0e0;
		color: #333;
		padding: 8px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.variant-btn:hover {
		border-color: #ff6b6b;
	}

	.variant-btn.selected {
		border-color: #ff6b6b;
		background-color: #ff6b6b;
		color: white;
	}

	.purchase-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: center;
		margin-bottom: 30px;
	}

	.quantity-selector {
		display: flex;
		align-items: center;
		gap: 12px;
		background-color: #f8f8f8;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 6px 12px;
	}

	.qty-btn {
		width: 32px;
		height: 32px;
		background-color: #ff6b6b;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1.2rem;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.qty-btn:hover {
		background-color: #ff5252;
	}

	.quantity-display {
		font-weight: 700;
		font-size: 1.1rem;
		min-width: 30px;
		text-align: center;
	}

	.add-to-cart-btn {
		flex: 1;
		min-width: 160px;
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 14px 24px;
		border-radius: 8px;
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.add-to-cart-btn:hover {
		background-color: #ff5252;
	}

	.buy-now-btn {
		flex: 1;
		min-width: 160px;
		background-color: #1a1a1a;
		color: white;
		border: none;
		padding: 14px 24px;
		border-radius: 8px;
		font-size: 1.05rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.buy-now-btn:hover {
		background-color: #333;
	}

	.wishlist-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: #f8f8f8;
		border: 2px solid #e0e0e0;
		color: #333;
		padding: 14px 20px;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.wishlist-btn:hover {
		border-color: #ff6b6b;
		background-color: #fff0f0;
	}

	.wishlist-btn.active {
		border-color: #ff6b6b;
		background-color: #fff5f5;
		color: #ff6b6b;
	}

	.heart-icon {
		font-size: 1.1rem;
	}

	.details-footer {
		border-top: 1px solid #e0e0e0;
		padding-top: 20px;
	}

	.back-link {
		color: #666;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.95rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #ff6b6b;
	}

	@media (max-width: 850px) {
		.product-detail-card {
			grid-template-columns: 1fr;
			padding: 24px;
		}

		.product-title {
			font-size: 1.8rem;
		}

		.purchase-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.quantity-selector {
			justify-content: center;
		}
	}
</style>
