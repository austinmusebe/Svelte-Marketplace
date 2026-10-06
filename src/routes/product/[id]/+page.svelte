<script>
	import { cart, isCartOpen } from '../../../stores/cart.js';
	import { wishlist } from '../../../stores/wishlist.js';
	import ProductCard from '../../../components/ProductCard.svelte';
	import { Heart } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let product = $derived(data.product);
	let relatedProducts = $derived(data.relatedProducts || []);

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
						fill={isFavorite ? 'var(--accent-primary)' : 'none'}
						color={isFavorite ? 'var(--accent-primary)' : 'currentColor'}
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

	{#if relatedProducts && relatedProducts.length > 0}
		<section class="related-section">
			<h2>Related Products ({product.category})</h2>
			<div class="related-grid">
				{#each relatedProducts as relatedProduct (relatedProduct.id)}
					<ProductCard product={relatedProduct} showWishlist={false} />
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.product-page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 24px;
		min-height: 80vh;
	}

	.breadcrumbs {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 24px;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.breadcrumbs a {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.breadcrumbs a:hover {
		color: var(--accent-primary);
	}

	.current-crumb {
		color: var(--text-contrast);
		font-weight: 500;
	}

	.product-detail-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		box-shadow: var(--shadow-subtle);
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
		background-color: var(--bg-canvas);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		min-height: 400px;
		overflow: hidden;
	}

	.detail-image {
		width: 100%;
		max-height: 500px;
		object-fit: cover;
	}

	.placeholder-large {
		color: var(--text-subtle);
		font-size: 1.125rem;
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
		background-color: var(--bg-subtle);
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		padding: 4px 12px;
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		font-weight: 600;
		margin-bottom: 16px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.product-title {
		margin: 0 0 12px 0;
		font-size: 2.25rem;
		color: var(--text-contrast);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.15;
	}

	.product-price {
		font-size: 1.5rem;
		color: var(--accent-primary);
		font-weight: 700;
		margin: 0 0 16px 0;
	}

	.stock-status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-success);
		margin-bottom: 24px;
	}

	.stock-status.low-stock {
		color: var(--color-warning);
	}

	.stock-dot {
		font-size: 0.75rem;
	}

	.stock-dot.in-stock {
		color: var(--color-success);
	}

	.stock-dot.low-stock {
		color: var(--color-warning);
	}

	.stock-dot.out-of-stock {
		color: var(--color-destructive);
	}

	.product-description {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--text-body);
		margin: 0 0 28px 0;
	}

	.variant-section {
		margin-bottom: 28px;
	}

	.variant-section label {
		display: block;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-muted);
		margin-bottom: 10px;
	}

	.variant-options {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.variant-btn {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		color: var(--text-muted);
		padding: 8px 16px;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.variant-btn:hover {
		border-color: var(--border-strong);
		color: var(--text-contrast);
	}

	.variant-btn.selected {
		border-color: var(--text-contrast);
		background-color: var(--text-contrast);
		color: var(--bg-surface);
	}

	.purchase-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		margin-bottom: 32px;
	}

	.quantity-selector {
		display: flex;
		align-items: center;
		gap: 8px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 6px;
	}

	.qty-btn {
		width: 32px;
		height: 32px;
		background-color: transparent;
		color: var(--text-body);
		border: none;
		border-radius: 4px;
		font-size: 1.25rem;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s;
	}

	.qty-btn:hover {
		background-color: var(--bg-subtle);
	}

	.quantity-display {
		font-weight: 600;
		font-size: 1rem;
		min-width: 24px;
		text-align: center;
		color: var(--text-body);
	}

	.add-to-cart-btn {
		flex: 1;
		min-width: 140px;
		background-color: var(--accent-primary);
		color: #ffffff;
		border: none;
		padding: 14px 24px;
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: transform 0.1s ease, background-color 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.add-to-cart-btn:hover {
		background-color: var(--accent-hover);
	}
	
	.add-to-cart-btn:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}

	.buy-now-btn {
		flex: 1;
		min-width: 140px;
		background-color: var(--text-contrast);
		color: var(--bg-surface);
		border: none;
		padding: 14px 24px;
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.buy-now-btn:hover {
		background-color: var(--text-body);
	}

	.wishlist-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		color: var(--text-body);
		padding: 12px 16px;
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.wishlist-btn:hover {
		border-color: var(--border-strong);
		background-color: var(--bg-subtle);
	}

	.wishlist-btn.active {
		color: var(--color-destructive);
	}

	.details-footer {
		border-top: 1px solid var(--border-default);
		padding-top: 20px;
	}

	.back-link {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--text-contrast);
	}

	.related-section {
		margin-top: 48px;
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		box-shadow: var(--shadow-subtle);
		padding: 32px;
	}

	.related-section h2 {
		margin: 0 0 24px 0;
		font-size: 1.5rem;
		color: var(--text-contrast);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.related-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
	}

	@media (max-width: 850px) {
		.product-detail-card {
			grid-template-columns: 1fr;
			padding: 24px;
		}

		.related-section {
			padding: 24px;
		}

		.product-title {
			font-size: 1.75rem;
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
