<script>
	import ProductCard from '../components/ProductCard.svelte';
	import { products } from '$lib/products.js';
	import { ArrowRight } from 'lucide-svelte';

	const audioProducts = products.filter((p) => p.category === 'Audio').slice(0, 2);
	const wearableProducts = products.filter((p) => p.category === 'Wearables').slice(0, 2);
	const accessoryProducts = products.filter((p) => p.category === 'Accessories').slice(0, 2);
</script>

<div class="holder">
	<div class="hero-section">
		<h1 class="hero-title">Welcome to Our Store</h1>
		<p class="hero-subtitle">High performance gadgets and premium accessories designed for the modern aesthetic.</p>
		<a href="/home" class="start-button">
			Start Shopping
			<ArrowRight size={18} />
		</a>
	</div>

	<div class="category-sections">
		<div class="product-row">
			<div class="category-header">
				<h2 class="category-title">Audio</h2>
				<a href="/home?category=Audio" class="view-category-link">
					View all
					<ArrowRight size={16} />
				</a>
			</div>
			<div class="product-holder">
				{#each audioProducts as product}
					<ProductCard {product} />
				{/each}
			</div>
		</div>

		<div class="product-row">
			<div class="category-header">
				<h2 class="category-title">Wearables</h2>
				<a href="/home?category=Wearables" class="view-category-link">
					View all
					<ArrowRight size={16} />
				</a>
			</div>
			<div class="product-holder">
				{#each wearableProducts as product}
					<ProductCard {product} />
				{/each}
			</div>
		</div>

		<div class="product-row">
			<div class="category-header">
				<h2 class="category-title">Accessories</h2>
				<a href="/home?category=Accessories" class="view-category-link">
					View all
					<ArrowRight size={16} />
				</a>
			</div>
			<div class="product-holder">
				{#each accessoryProducts as product}
					<ProductCard {product} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.holder {
		max-width: 1200px;
		margin: 0 auto;
		padding: 32px 24px;
		display: flex;
		flex-direction: column;
		gap: 64px;
	}

	.hero-section {
		text-align: center;
		padding: 64px 24px;
		background: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-canvas) 100%);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		box-shadow: var(--shadow-subtle);
	}

	.hero-title {
		font-size: 2.5rem;
		line-height: 1.15;
		font-weight: 700;
		letter-spacing: -0.025em;
		margin: 0;
		color: var(--text-contrast);
	}

	.hero-subtitle {
		font-size: 1.125rem;
		color: var(--text-muted);
		max-width: 600px;
		margin: 0;
		line-height: 1.5;
	}

	.start-button {
		background-color: var(--accent-primary);
		color: #ffffff;
		font-size: 0.9375rem;
		padding: 12px 24px;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: 500;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition: transform 0.1s ease, background-color 0.2s;
		box-shadow: var(--shadow-subtle);
		margin-top: 12px;
	}

	.start-button:hover {
		background-color: var(--accent-hover);
	}

	.start-button:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}

	.category-sections {
		display: flex;
		flex-direction: column;
		gap: 48px;
	}

	.product-row {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.category-title {
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--text-contrast);
		margin: 0;
	}

	.view-category-link {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		transition: color 0.2s;
	}

	.view-category-link:hover {
		color: var(--text-contrast);
	}

	.product-holder {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}
</style>
