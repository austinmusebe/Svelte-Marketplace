<script>
	import { Check, CheckCircle2, Mail, Phone } from 'lucide-svelte';

	let { data } = $props();
	let order = $derived(data.order);
</script>

<div class="confirmation-container">
	<div class="confirmation-card">
		<div class="success-banner">
			<span class="success-icon">
				<CheckCircle2 size={44} color="#27ae60" />
			</span>
			<h1>Order Confirmed!</h1>
			<p class="order-number">Order ID: <strong>{order.orderId}</strong></p>
			<p class="order-date">Placed on {new Date(order.date || order.createdAt).toLocaleDateString()}</p>
		</div>

		<div class="content-grid">
			<div class="items-column">
				<h2>Items Purchased</h2>
				<div class="items-list">
					{#each order.items as item}
						<div class="order-item">
							<div class="item-img">
								{#if item.product.image}
									<img src={item.product.image} alt={item.product.name} />
								{:else}
									<div class="placeholder-small">No Image</div>
								{/if}
							</div>
							<div class="item-meta">
								<h3>{item.product.name}</h3>
								<p class="unit-price">${item.product.price.toFixed(2)} × {item.quantity}</p>
							</div>
							<p class="line-total">${(item.product.price * item.quantity).toFixed(2)}</p>
						</div>
					{/each}
				</div>

				<div class="order-summary-box">
					<div class="summary-line">
						<span>Total Paid:</span>
						<span class="highlight-total">${order.total}</span>
					</div>
				</div>
			</div>

			<div class="details-column">
				<div class="info-card">
					<h3>Delivery Address</h3>
					<div class="info-content">
						<p><strong>{order.shipping.fullName}</strong></p>
						<p>{order.shipping.street}</p>
						<p>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</p>
						<p>{order.shipping.country}</p>
						<p class="contact-info">
							<Phone size={14} />
							<span>{order.shipping.phone}</span>
						</p>
						<p class="contact-info">
							<Mail size={14} />
							<span>{order.shipping.email}</span>
						</p>
					</div>
				</div>

				<div class="info-card">
					<h3>Payment Summary</h3>
					<div class="info-content">
						<p><strong>Card ending in {order.payment?.last4 || '••••'}</strong></p>
						{#if order.payment?.cardName}
							<p>{order.payment.cardName}</p>
						{/if}
						<p class="payment-badge">
							<Check size={16} />
							<span>Payment Processed</span>
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="actions-group">
			<a href="/home" class="btn-shopping">Continue Shopping</a>
			<a href="/account" class="btn-account">View Account Orders</a>
		</div>
	</div>
</div>

<style>
	.confirmation-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 40px 24px;
		min-height: 80vh;
	}

	.confirmation-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-subtle);
		padding: 40px;
		overflow: hidden;
		border: 1px solid var(--border-default);
	}

	.success-banner {
		text-align: center;
		padding-bottom: 32px;
		border-bottom: 1px solid var(--border-default);
		margin-bottom: 32px;
	}

	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		border-radius: var(--radius-full);
		background-color: #fff4ed;
		color: var(--text-contrast);
		font-size: 2.2rem;
		font-weight: bold;
		margin-bottom: 16px;
	}

	.success-banner h1 {
		margin: 0 0 8px 0;
		font-size: 2.25rem;
		color: var(--text-contrast);
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.order-number {
		font-size: 1.125rem;
		color: var(--text-body);
		margin: 0 0 4px 0;
	}

	.order-date {
		font-size: 0.9375rem;
		color: var(--text-muted);
		margin: 0;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 32px;
		margin-bottom: 40px;
	}

	.items-column h2 {
		margin: 0 0 16px 0;
		font-size: 1.25rem;
		color: var(--text-contrast);
		font-weight: 600;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.order-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		background-color: var(--bg-subtle);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
	}

	.item-img {
		width: 48px;
		height: 48px;
		background-color: var(--bg-surface);
		border-radius: var(--radius-sm);
		overflow: hidden;
		flex-shrink: 0;
		border: 1px solid var(--border-default);
	}

	.item-img img {
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
		font-size: 0.625rem;
	}

	.item-meta {
		flex: 1;
		min-width: 0;
	}

	.item-meta h3 {
		margin: 0 0 4px 0;
		font-size: 0.9375rem;
		color: var(--text-contrast);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 500;
	}

	.unit-price {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.line-total {
		font-weight: 600;
		color: var(--text-contrast);
		font-size: 1rem;
		margin: 0;
	}

	.order-summary-box {
		padding: 16px;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
	}

	.summary-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-body);
	}

	.highlight-total {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--accent-primary);
	}

	.details-column {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.info-card {
		background-color: var(--bg-subtle);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		padding: 24px;
	}

	.info-card h3 {
		margin: 0 0 16px 0;
		font-size: 1.125rem;
		color: var(--text-contrast);
		border-bottom: 1px solid var(--border-subtle);
		padding-bottom: 8px;
		font-weight: 600;
	}

	.info-content p {
		margin: 0 0 8px 0;
		color: var(--text-body);
		font-size: 0.9375rem;
		line-height: 1.5;
	}
	
	.info-content p strong {
		color: var(--text-contrast);
	}

	.contact-info {
		color: var(--text-muted) !important;
		font-size: 0.875rem !important;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.payment-badge {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--color-success) !important;
		font-weight: 500;
		font-size: 0.9375rem !important;
		margin-top: 8px !important;
	}

	.actions-group {
		display: flex;
		gap: 16px;
		justify-content: center;
		padding-top: 32px;
		border-top: 1px solid var(--border-default);
	}

	.btn-shopping {
		background-color: var(--accent-primary);
		color: #ffffff;
		text-decoration: none;
		padding: 12px 28px;
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: background-color 0.2s, transform 0.1s ease;
		box-shadow: var(--shadow-subtle);
	}

	.btn-shopping:hover {
		background-color: var(--accent-hover);
	}

	.btn-shopping:active {
		transform: scale(0.98);
	}

	.btn-account {
		background-color: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		text-decoration: none;
		padding: 12px 28px;
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-account:hover {
		border-color: var(--border-strong);
		color: var(--text-contrast);
		background-color: var(--bg-subtle);
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.actions-group {
			flex-direction: column;
		}

		.btn-shopping,
		.btn-account {
			text-align: center;
		}
	}
</style>
