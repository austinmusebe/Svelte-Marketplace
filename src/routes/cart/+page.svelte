<script>
	import { cart } from '../../stores/cart.js';
	import CartItem from '../../components/CartItem.svelte';
	import { ShoppingCart } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let cartItems = $state([]);

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	let total = $derived(cart.getTotal(cartItems));

	function proceedToCheckout() {
		if (cartItems.length > 0) {
			goto('/checkout');
		}
	}

	function clearCart() {
		cart.clear();
	}
</script>

<div class="cart-page-container">
	<div class="cart-header">
		<h1>Your Shopping Cart</h1>
		<p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
	</div>

	{#if cartItems.length === 0}
		<div class="empty-cart-card">
			<span class="empty-icon">
				<ShoppingCart size={64} color="#bbb" />
			</span>
			<h2>Your cart is empty</h2>
			<p>Looks like you haven't added anything to your cart yet.</p>
			<a href="/home" class="btn-shop">Start Shopping</a>
		</div>
	{:else}
		<div class="cart-grid">
			<div class="cart-items-card">
				<div class="items-header">
					<h2>Cart Items</h2>
					<button class="clear-btn" onclick={clearCart}>Clear Cart</button>
				</div>
				<div class="items-list">
					{#each cartItems as item}
						<CartItem {item} />
					{/each}
				</div>
			</div>

			<div class="cart-summary-sidebar">
				<div class="summary-card">
					<h2>Order Summary</h2>
					<div class="summary-row">
						<span>Subtotal</span>
						<span>${total.toFixed(2)}</span>
					</div>
					<div class="summary-row">
						<span>Estimated Shipping</span>
						<span>$5.00</span>
					</div>
					<div class="summary-row">
						<span>Estimated Tax</span>
						<span>${(total * 0.08).toFixed(2)}</span>
					</div>
					<div class="summary-divider"></div>
					<div class="summary-total">
						<span>Estimated Total</span>
						<span>${(total + 5 + total * 0.08).toFixed(2)}</span>
					</div>
					<button class="checkout-btn" onclick={proceedToCheckout}>
						Proceed to Checkout
					</button>
					<a href="/home" class="continue-link">← Continue Shopping</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.cart-page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 40px 24px;
		min-height: 80vh;
	}

	.cart-header {
		margin-bottom: 32px;
	}

	.cart-header h1 {
		margin: 0 0 8px 0;
		font-size: 2.25rem;
		color: var(--text-contrast);
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.cart-header p {
		margin: 0;
		color: var(--text-muted);
		font-size: 1rem;
	}

	.empty-cart-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 80px 24px;
		text-align: center;
		box-shadow: var(--shadow-subtle);
	}

	.empty-icon {
		margin-bottom: 16px;
		display: block;
		color: var(--text-subtle);
	}

	.empty-cart-card h2 {
		margin: 0 0 8px 0;
		font-size: 1.5rem;
		color: var(--text-contrast);
		font-weight: 600;
	}

	.empty-cart-card p {
		margin: 0 0 24px 0;
		color: var(--text-muted);
	}

	.btn-shop {
		display: inline-block;
		background-color: var(--accent-primary);
		color: #ffffff;
		text-decoration: none;
		padding: 12px 28px;
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: background-color 0.2s, transform 0.1s ease;
		box-shadow: var(--shadow-subtle);
	}

	.btn-shop:hover {
		background-color: var(--accent-hover);
	}

	.btn-shop:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}

	.cart-grid {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 32px;
		align-items: flex-start;
	}

	.cart-items-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		padding: 32px;
		box-shadow: var(--shadow-subtle);
	}

	.items-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border-default);
	}

	.items-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-contrast);
		font-weight: 600;
	}

	.clear-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		padding: 4px 8px;
		transition: color 0.2s;
	}

	.clear-btn:hover {
		color: var(--color-destructive);
	}

	.items-list {
		display: flex;
		flex-direction: column;
	}

	.cart-summary-sidebar {
		position: sticky;
		top: 100px;
	}

	.summary-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		padding: 32px;
		box-shadow: var(--shadow-subtle);
	}

	.summary-card h2 {
		margin: 0 0 20px 0;
		font-size: 1.25rem;
		color: var(--text-contrast);
		font-weight: 600;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border-default);
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		color: var(--text-body);
		font-size: 0.9375rem;
	}

	.summary-divider {
		height: 1px;
		background-color: var(--border-default);
		margin: 20px 0;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-contrast);
	}

	.summary-total span:last-child {
		color: var(--accent-primary);
		font-size: 1.5rem;
		font-weight: 700;
	}

	.checkout-btn {
		width: 100%;
		background-color: var(--accent-primary);
		color: #ffffff;
		border: none;
		padding: 14px;
		border-radius: var(--radius-md);
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s, transform 0.1s ease;
		margin-bottom: 16px;
		box-shadow: var(--shadow-subtle);
	}

	.checkout-btn:hover {
		background-color: var(--accent-hover);
	}

	.checkout-btn:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}

	.continue-link {
		display: block;
		text-align: center;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	.continue-link:hover {
		color: var(--text-contrast);
	}

	@media (max-width: 900px) {
		.cart-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
