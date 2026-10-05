<script>
	import ProductCard from '../../components/ProductCard.svelte';
	import { isCartOpen } from '../../stores/cart.js';
	import { products, getCategories } from '$lib/products.js';
	import { Search, X } from 'lucide-svelte';

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
					selectedCategory === 'All' ||
					product.category.toLowerCase() === selectedCategory.toLowerCase();
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
		<button class="view-cart-btn" onclick={openCart}> View Cart </button>
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
				<button class="clear-search-btn" onclick={() => (searchQuery = '')} aria-label="Clear search">
					<X size={16} />
				</button>
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
			<div class="empty-icon">
				<Search size={54} color="#bbb" />
			</div>
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
		padding: 32px 24px;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin-bottom: 32px;
	}

	.header-section h1 {
		margin: 0 0 4px 0;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--text-contrast);
	}

	.subtitle {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.9375rem;
	}

	.view-cart-btn {
		background-color: transparent;
		color: var(--text-contrast);
		border: 1px solid var(--border-default);
		padding: 10px 20px;
		border-radius: var(--radius-md);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.view-cart-btn:hover {
		background-color: var(--bg-subtle);
		border-color: var(--border-strong);
	}

	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.search-wrap {
		position: relative;
		flex: 1;
		min-width: 250px;
	}

	.search-input {
		width: 100%;
		padding: 10px 36px 10px 16px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--text-body);
		box-sizing: border-box;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--border-focus);
		box-shadow: 0 0 0 1px var(--border-focus);
	}

	.search-input::placeholder {
		color: var(--text-subtle);
	}

	.clear-search-btn {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--text-subtle);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		transition: color 0.2s;
	}

	.clear-search-btn:hover {
		color: var(--text-contrast);
	}

	.sort-wrap {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.sort-wrap label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted);
	}

	.sort-select {
		padding: 10px 32px 10px 16px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		color: var(--text-body);
		cursor: pointer;
		appearance: none;
		/* Inline SVG chevron to replace the default browser dropdown arrow with a clean custom icon */
		background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2318181b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		background-size: 10px auto;
		box-shadow: var(--shadow-subtle);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.sort-select:focus {
		outline: none;
		border-color: var(--border-focus);
		box-shadow: 0 0 0 1px var(--border-focus);
	}

	.category-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 32px;
	}

	.category-tab {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		color: var(--text-muted);
		padding: 6px 16px;
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.category-tab:hover {
		border-color: var(--border-strong);
		color: var(--text-contrast);
	}

	.category-tab.active {
		background-color: var(--text-contrast);
		border-color: var(--text-contrast);
		color: var(--bg-surface);
	}

	.empty-catalog {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 64px 24px;
		text-align: center;
		box-shadow: var(--shadow-subtle);
	}

	.empty-icon {
		margin-bottom: 16px;
		color: var(--text-subtle);
	}

	.empty-catalog h2 {
		margin: 0 0 8px 0;
		font-size: 1.25rem;
		color: var(--text-contrast);
		font-weight: 600;
	}

	.empty-catalog p {
		margin: 0 0 24px 0;
		color: var(--text-muted);
		font-size: 0.9375rem;
	}

	.reset-btn {
		background-color: var(--bg-surface);
		color: var(--text-contrast);
		border: 1px solid var(--border-default);
		padding: 10px 20px;
		border-radius: var(--radius-md);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.reset-btn:hover {
		background-color: var(--bg-subtle);
		border-color: var(--border-strong);
	}

	.product-section {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
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
