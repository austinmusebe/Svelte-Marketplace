<script>
	import { cart, isCartOpen } from '../stores/cart.js';
	import { goto } from '$app/navigation';
	import CartItem from './CartItem.svelte';
	import { ShoppingCart, X } from 'lucide-svelte';

	let cartItems = $state([]);
	let showCart = $state(false);

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	$effect(() => {
		isCartOpen.subscribe((value) => {
			showCart = value;
		});
	});

	function closeCart() {
		isCartOpen.set(false);
	}

	function removeItem(productId) {
		cart.removeItem(productId);
	}

	function updateQuantity(productId, quantity) {
		cart.updateQuantity(productId, quantity);
	}

	function proceedToCheckout() {
		if (cartItems.length > 0) {
			isCartOpen.set(false);
			goto('/checkout');
		}
	}

	// Changed from $: to $derived
	let total = $derived(cart.getTotal(cartItems));
</script>

{#if showCart}
	<div class="cart-overlay" onclick={closeCart} role="button" tabindex="0">
		<div class="cart-popup" onclick={(e) => e.stopPropagation()} role="dialog">
			<div class="cart-header">
				<h2>Shopping Cart ({cartItems.length})</h2>
				<button class="close-btn" onclick={closeCart} aria-label="Close cart">
					<X size={20} />
				</button>
			</div>

			<div class="cart-body">
				{#if cartItems.length === 0}
					<div class="empty-cart">
						<span class="empty-icon">
							<ShoppingCart size={48} color="#999" />
						</span>
						<p>Your cart is empty</p>
						<button class="continue-shopping" onclick={closeCart}> Continue Shopping </button>
					</div>
				{:else}
					<div class="cart-items">
						{#each cartItems as item}
							<CartItem {item} />
						{/each}
					</div>

					<div class="cart-footer">
						<div class="cart-total">
							<span>Total:</span>
							<span class="total-amount">${total.toFixed(2)}</span>
						</div>
						<button class="checkout-btn" onclick={proceedToCheckout}> Proceed to Checkout </button>
						<a href="/cart" class="view-cart-link" onclick={closeCart}> View Full Cart </a>
						<button class="continue-btn" onclick={closeCart}> Continue Shopping </button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.cart-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(9, 9, 11, 0.4);
		backdrop-filter: blur(4px);
		z-index: 1000;
		display: flex;
		justify-content: flex-end;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.cart-popup {
		width: 100%;
		max-width: 440px;
		background-color: var(--bg-surface);
		box-shadow: var(--shadow-drawer);
		display: flex;
		flex-direction: column;
		animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		max-height: 100vh;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	.cart-header {
		padding: 24px;
		border-bottom: 1px solid var(--border-default);
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: var(--bg-surface);
		color: var(--text-contrast);
	}

	.cart-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		transition: background-color 0.2s, color 0.2s;
	}

	.close-btn:hover {
		background-color: var(--bg-subtle);
		color: var(--text-contrast);
	}

	.cart-body {
		flex: 1;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.empty-cart {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 24px;
		text-align: center;
	}

	.empty-icon {
		margin-bottom: 16px;
		color: var(--text-subtle);
	}

	.empty-cart p {
		color: var(--text-muted);
		font-size: 1rem;
		margin: 0 0 24px 0;
	}

	.continue-shopping {
		background-color: transparent;
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

	.continue-shopping:hover {
		background-color: var(--bg-subtle);
		border-color: var(--border-strong);
	}

	.cart-items {
		flex: 1;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.cart-footer {
		padding: 24px;
		border-top: 1px solid var(--border-default);
		background-color: var(--bg-surface);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.cart-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		font-size: 1.125rem;
		color: var(--text-body);
		font-weight: 500;
	}

	.total-amount {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-contrast);
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
		transition: transform 0.1s ease, background-color 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.checkout-btn:hover {
		background-color: var(--accent-hover);
	}
	
	.checkout-btn:active {
		transform: scale(0.98);
		background-color: var(--accent-active);
	}

	.view-cart-link {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		padding: 12px;
		color: var(--text-contrast);
		background-color: transparent;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		transition: all 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.view-cart-link:hover {
		background-color: var(--bg-subtle);
		border-color: var(--border-strong);
	}

	.continue-btn {
		width: 100%;
		background-color: transparent;
		color: var(--text-muted);
		border: none;
		padding: 12px;
		border-radius: var(--radius-md);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: color 0.2s, background-color 0.2s;
	}

	.continue-btn:hover {
		color: var(--text-contrast);
		background-color: var(--bg-subtle);
	}

	@media (max-width: 568px) {
		.cart-popup {
			max-width: 100%;
		}
	}
</style>
