<script>
	import { cart } from '../stores/cart.js';
	import { Trash2 } from 'lucide-svelte';

	let { item } = $props();

	function updateQuantity(quantity) {
		cart.updateQuantity(item.product.id, quantity);
	}

	function removeItem() {
		cart.removeItem(item.product.id);
	}
</script>

<div class="cart-item">
	<div class="item-image">
		{#if item.product.image}
			<img src={item.product.image} alt={item.product.name} />
		{:else}
			<div class="placeholder-small">No Image</div>
		{/if}
	</div>
	<div class="item-details">
		<h3>{item.product.name}</h3>
		<p class="item-price">${item.product.price.toFixed(2)}</p>
	</div>
	<div class="item-quantity">
		<button class="qty-btn" onclick={() => updateQuantity(item.quantity - 1)} aria-label="Decrease quantity">
			-
		</button>
		<span>{item.quantity}</span>
		<button class="qty-btn" onclick={() => updateQuantity(item.quantity + 1)} aria-label="Increase quantity">
			+
		</button>
	</div>
	<div class="item-total">
		<p>${(item.product.price * item.quantity).toFixed(2)}</p>
	</div>
	<button class="remove-btn" onclick={removeItem} aria-label="Remove item">
		<Trash2 size={16} />
	</button>
</div>

<style>
	.cart-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px 0;
		background-color: transparent;
		border-bottom: 1px solid var(--border-default);
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.item-image {
		width: 64px;
		height: 64px;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-small {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-subtle);
		font-size: 0.75rem;
		text-align: center;
	}

	.item-details {
		flex: 1;
		min-width: 0;
	}

	.item-details h3 {
		margin: 0 0 4px 0;
		font-size: 0.9375rem;
		color: var(--text-contrast);
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-price {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.item-quantity {
		display: flex;
		align-items: center;
		gap: 4px;
		background-color: var(--bg-subtle);
		border-radius: var(--radius-sm);
		padding: 4px;
		border: 1px solid var(--border-default);
	}

	.qty-btn {
		width: 24px;
		height: 24px;
		background-color: transparent;
		color: var(--text-body);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s, color 0.2s;
	}

	.qty-btn:hover {
		background-color: var(--bg-surface);
		color: var(--text-contrast);
		box-shadow: var(--shadow-subtle);
	}

	.item-quantity span {
		min-width: 20px;
		text-align: center;
		font-weight: 500;
		font-size: 0.875rem;
		color: var(--text-body);
	}

	.item-total {
		font-weight: 600;
		color: var(--text-contrast);
		font-size: 1rem;
		min-width: 60px;
		text-align: right;
	}

	.item-total p {
		margin: 0;
	}

	.remove-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-muted);
		padding: 8px;
		transition: color 0.2s, background-color 0.2s;
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.remove-btn:hover {
		color: var(--color-destructive);
		background-color: var(--color-destructive-bg);
	}

	@media (max-width: 568px) {
		.cart-item {
			flex-wrap: wrap;
			position: relative;
			padding-bottom: 24px;
		}

		.item-total {
			order: 4;
			width: 100%;
			text-align: left;
			margin-top: 8px;
		}
		
		.remove-btn {
			position: absolute;
			top: 16px;
			right: 0;
		}
	}
</style>
