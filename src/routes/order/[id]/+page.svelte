<script>
	let { data } = $props();
	let order = $derived(data.order);
</script>

<div class="confirmation-container">
	<div class="confirmation-card">
		<div class="success-banner">
			<span class="success-icon">✓</span>
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
						<p class="contact-info">📞 {order.shipping.phone}</p>
						<p class="contact-info">✉️ {order.shipping.email}</p>
					</div>
				</div>

				<div class="info-card">
					<h3>Payment Summary</h3>
					<div class="info-content">
						<p><strong>Card ending in {order.payment?.last4 || '••••'}</strong></p>
						{#if order.payment?.cardName}
							<p>{order.payment.cardName}</p>
						{/if}
						<p class="payment-badge">✓ Payment Processed</p>
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
	:global(body) {
		margin: 0;
		padding: 0;
		background-color: #f5f5f5;
	}

	.confirmation-container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 40px 20px;
		min-height: 80vh;
	}

	.confirmation-card {
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
		padding: 40px;
		overflow: hidden;
	}

	.success-banner {
		text-align: center;
		padding-bottom: 30px;
		border-bottom: 1px solid #e0e0e0;
		margin-bottom: 30px;
	}

	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background-color: #4caf50;
		color: white;
		font-size: 2.2rem;
		font-weight: bold;
		margin-bottom: 16px;
	}

	.success-banner h1 {
		margin: 0 0 8px 0;
		font-size: 2.2rem;
		color: #1a1a1a;
	}

	.order-number {
		font-size: 1.1rem;
		color: #555;
		margin: 0 0 4px 0;
	}

	.order-date {
		font-size: 0.95rem;
		color: #888;
		margin: 0;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 30px;
		margin-bottom: 40px;
	}

	.items-column h2 {
		margin: 0 0 16px 0;
		font-size: 1.3rem;
		color: #1a1a1a;
	}

	.items-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.order-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px;
		background-color: #f8f8f8;
		border-radius: 10px;
	}

	.item-img {
		width: 50px;
		height: 50px;
		background-color: black;
		border-radius: 6px;
		overflow: hidden;
		flex-shrink: 0;
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
		color: #999;
		font-size: 0.65rem;
	}

	.item-meta {
		flex: 1;
		min-width: 0;
	}

	.item-meta h3 {
		margin: 0 0 4px 0;
		font-size: 0.95rem;
		color: #1a1a1a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.unit-price {
		margin: 0;
		color: #666;
		font-size: 0.85rem;
	}

	.line-total {
		font-weight: 700;
		color: #1a1a1a;
		font-size: 1rem;
		margin: 0;
	}

	.order-summary-box {
		padding: 16px;
		background-color: #f0f9ff;
		border: 1px solid #bae6fd;
		border-radius: 10px;
	}

	.summary-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.1rem;
		font-weight: 600;
		color: #0369a1;
	}

	.highlight-total {
		font-size: 1.5rem;
		font-weight: 800;
		color: #ff6b6b;
	}

	.details-column {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.info-card {
		background-color: #f8f8f8;
		border-radius: 12px;
		padding: 20px;
	}

	.info-card h3 {
		margin: 0 0 12px 0;
		font-size: 1.1rem;
		color: #1a1a1a;
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 8px;
	}

	.info-content p {
		margin: 0 0 6px 0;
		color: #555;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.contact-info {
		color: #777;
		font-size: 0.9rem;
	}

	.payment-badge {
		display: inline-block;
		color: #27ae60;
		font-weight: 600;
		font-size: 0.9rem;
		margin-top: 6px;
	}

	.actions-group {
		display: flex;
		gap: 16px;
		justify-content: center;
		padding-top: 20px;
		border-top: 1px solid #e0e0e0;
	}

	.btn-shopping {
		background-color: #ff6b6b;
		color: white;
		text-decoration: none;
		padding: 14px 28px;
		border-radius: 8px;
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.btn-shopping:hover {
		background-color: #ff5252;
	}

	.btn-account {
		background-color: white;
		color: #333;
		border: 1px solid #ccc;
		text-decoration: none;
		padding: 14px 28px;
		border-radius: 8px;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-account:hover {
		border-color: #ff6b6b;
		color: #ff6b6b;
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
