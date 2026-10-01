<script>
	import ProductCard from '../components/ProductCard.svelte';
	import { products } from '$lib/products.js';

	const audioProducts = products.filter((p) => p.category === 'Audio').slice(0, 2);
	const wearableProducts = products.filter((p) => p.category === 'Wearables').slice(0, 2);
	const accessoryProducts = products.filter((p) => p.category === 'Accessories').slice(0, 2);
</script>

<div class="holder">
	<div class="hero-section">
		<h1 class="hero-title">Welcome to Our Store</h1>
		<p class="hero-subtitle">High performance gadgets and premium accessories</p>
		<a href="/home" class="start-button">Start Shopping</a>
	</div>

	<div class="category-sections">
		<div class="product-row">
			<div class="category-header">
				<h2 class="category-title">Audio</h2>
				<a href="/home?category=Audio" class="view-category-link">View All Audio →</a>
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
				<a href="/home?category=Wearables" class="view-category-link">View All Wearables →</a>
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
				<a href="/home?category=Accessories" class="view-category-link">View All Accessories →</a>
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
		padding: 40px 20px;
		display: flex;
		flex-direction: column;
		gap: 50px;
	}

	.hero-section {
		text-align: center;
		padding: 60px 20px;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		border-radius: 16px;
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.hero-title {
		font-size: 2.8rem;
		margin: 0;
		color: white;
	}

	.hero-subtitle {
		font-size: 1.1rem;
		color: #ccc;
		margin: 0 0 10px 0;
	}

	.start-button {
		background: orangered;
		font-size: 1.2rem;
		padding: 12px 30px;
		border-radius: 8px;
		color: white;
		text-decoration: none;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.start-button:hover {
		background: #ff5252;
	}

	.category-sections {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.category-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		border-bottom: 2px solid #e0e0e0;
		padding-bottom: 10px;
	}

	.category-title {
		font-size: 1.8rem;
		color: orangered;
		margin: 0;
	}

	.view-category-link {
		color: #ff6b6b;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.view-category-link:hover {
		text-decoration: underline;
	}

	.product-holder {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 24px;
	}
</style>
