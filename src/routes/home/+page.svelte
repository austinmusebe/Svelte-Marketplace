<script>
	import ProductCard from '../../components/ProductCard.svelte';
	import { isCartOpen } from '../../stores/cart.js';
	import { products, getCategories } from '$lib/products.js';

	let { data } = $props();

	let categories = getCategories();
	let selectedCategory = $state(data?.category || 'All');
	let searchQuery = $state(data?.search || '');
	let sortBy = $state('featured');

	$effect(() => {
		if (data?.category) {
			selectedCategory = data.category;
		}
	});

	let filteredProducts = $derived(
		products
			.filter((product) => {
				const matchesCategory =
					selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
				const matchesSearch =
					!searchQuery.trim() ||
					product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					product.description.toLowerCase().includes(searchQuery.toLowerCase());
				return matchesCategory && matchesSearch;
			})
			.sort((a, b) => {
				if (sortBy === 'price-asc') return a.price - b.price;
				if (sortBy === 'price-desc') return b.price - a.price;
				if (sortBy === 'name') return a.name.localeCompare(b.name);
				return 0;
			})
	);

	function openCart() {
		isCartOpen.set(true);
	}
</script>

<div class="container">
	<div class="header-section">
		<div>
			<h1>Our Products</h1>
			<p class="subtitle">Showing {filteredProducts.length} items</p>
		</div>
		<button class="view-cart-btn" onclick={openCart}>
			<span>🛒</span>
			View Cart
		</button>
	</div>

	<div class="filter-bar">
		<div class="search-wrap">
			<input
				type="text"
				placeholder="Search products..."
				bind:value={searchQuery}
				class="search-input"
			/>
			{#if searchQuery}
				<button class="clear-search-btn" onclick={() => (searchQuery = '')}>✕</button>
			{/if}
		</div>

		<div class="sort-wrap">
			<label for="sort-select">Sort by:</label>
			<select id="sort-select" bind:value={sortBy} class="sort-select">
				<option value="featured">Featured</option>
				<option value="price-asc">Price: Low to High</option>
				<option value="price-desc">Price: High to Low</option>
				<option value="name">Name: A to Z</option>
			</select>
		</div>
	</div>

	<div class="category-tabs">
		{#each categories as category}
			<button
				type="button"
				class="category-tab"
				class:active={selectedCategory.toLowerCase() === category.toLowerCase()}
				onclick={() => (selectedCategory = category)}
			>
				{category}
			</button>
		{/each}
	</div>

	{#if filteredProducts.length === 0}
		<div class="empty-catalog">
			<p class="empty-icon">🔍</p>
			<h2>No products found</h2>
			<p>We couldn't find anything matching your search. Try another query or category.</p>
			<button
				class="reset-btn"
				onclick={() => {
					selectedCategory = 'All';
					searchQuery = '';
				}}
			>
				Reset Filters
			</button>
		</div>
	{:else}
		<div class="product-section">
			{#each filteredProducts as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 20px;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.header-section h1 {
		margin: 0 0 6px 0;
		font-size: 2.2rem;
		color: #1a1a1a;
	}

	.subtitle {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
	}

	.view-cart-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: background-color 0.2s;
	}

	.view-cart-btn:hover {
		background-color: #ff5252;
	}

	.view-cart-btn span {
		font-size: 1.2rem;
	}

	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 250px;
	}

	.search-input {
		width: 100%;
		padding: 12px 36px 12px 16px;
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 0.95rem;
		box-sizing: border-box;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: #ff6b6b;
	}

	.clear-search-btn {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: #999;
		cursor: pointer;
		font-size: 1rem;
		padding: 4px;
	}

	.clear-search-btn:hover {
		color: #333;
	}

	.sort-wrap {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.sort-wrap label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #555;
	}

	.sort-select {
		padding: 10px 14px;
		background-color: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		font-size: 0.95rem;
		color: #333;
		cursor: pointer;
	}

	.sort-select:focus {
		outline: none;
		border-color: #ff6b6b;
	}

	.category-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 30px;
	}

	.category-tab {
		background-color: white;
		border: 1px solid #ddd;
		color: #555;
		padding: 8px 18px;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.category-tab:hover {
		border-color: #ff6b6b;
		color: #ff6b6b;
	}

	.category-tab.active {
		background-color: #ff6b6b;
		border-color: #ff6b6b;
		color: white;
		font-weight: 600;
	}

	.empty-catalog {
		background-color: white;
		border-radius: 12px;
		padding: 60px 20px;
		text-align: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.empty-icon {
		font-size: 3.5rem;
		margin-bottom: 12px;
		opacity: 0.5;
	}

	.empty-catalog h2 {
		margin: 0 0 8px 0;
		font-size: 1.5rem;
		color: #1a1a1a;
	}

	.empty-catalog p {
		margin: 0 0 20px 0;
		color: #666;
	}

	.reset-btn {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.reset-btn:hover {
		background-color: #ff5252;
	}

	.product-section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 30px;
	}

	@media (max-width: 768px) {
		.header-section {
			flex-direction: column;
			gap: 16px;
			align-items: flex-start;
		}

		.view-cart-btn {
			width: 100%;
			justify-content: center;
		}

		.filter-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.sort-wrap {
			justify-content: space-between;
		}

		.sort-select {
			flex: 1;
		}
	}
</style>
