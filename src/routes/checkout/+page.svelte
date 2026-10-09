<script>
	import { enhance } from '$app/forms';
	import { cart } from '../../stores/cart';
	import { currentUser } from '../../stores/user';
	import { addresses, defaultAddress } from '../../stores/addresses.js';
	import { Lock } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let user = $state(null);
	let cartItems = $state([]);
	let userAddresses = $state([]);
	let selectedDefaultAddress = $state(null);
	let total = $derived(cart.getTotal(cartItems));

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
			if (!u) {
				goto('/login');
			}
		});
	});

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
			if (items.length === 0) {
				goto('/home');
			}
		});
	});

	$effect(() => {
		addresses.subscribe((addrs) => {
			userAddresses = addrs;
		});
	});

	$effect(() => {
		defaultAddress.subscribe((addr) => {
			selectedDefaultAddress = addr;
			if (addr) {
				// Pre-fill shipping info from default address
				shippingInfo.fullName = user?.name || '';
				shippingInfo.email = user?.email || '';
				shippingInfo.phone = user?.phone || '';
				shippingInfo.street = addr.street;
				shippingInfo.city = addr.city;
				shippingInfo.state = addr.state;
				shippingInfo.zip = addr.zip;
				shippingInfo.country = addr.country;
				selectedAddressId = addr.id;
			}
		});
	});
	async function completeOrder() {
		const orderData = {
			orderId: `ORD-${Date.now()}`,
			userId: user?._id,
			items: cartItems,
			shipping: shippingInfo,
			payment: {
				last4: paymentInfo.cardNumber.slice(-4),
				cardName: paymentInfo.cardName
			},
			total: (total + 5 + total * 0.08).toFixed(2),
			date: new Date().toISOString()
		};

		// Save order
		const formData = new FormData();
		formData.append('orderData', JSON.stringify(orderData));

		try {
			await fetch('?/placeOrder', { method: 'POST', body: formData });
			if (user) {
				currentUser.set({
					...user,
					name: shippingInfo.fullName || user.name,
					phone: shippingInfo.phone || user.phone
				});
			}
			// alert('Order placed successfully!');
			cart.clear();
			goto(`/order/${orderData.orderId}`);
		} catch (error) {
			console.error('Failed to save order:', error);
			alert('Order failed. Please try again.');
		}
	}

	// Shipping Information
	let shippingInfo = $state({
		fullName: '',
		email: '',
		phone: '',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: 'USA'
	});

	let selectedAddressId = $state(null);
	let useNewAddress = $state(false);

	// Payment Information
	let paymentInfo = $state({
		cardNumber: '',
		cardName: '',
		expiryDate: '',
		cvv: '',
		saveCard: false
	});

	let currentStep = $state(1); // 1: Shipping, 2: Payment, 3: Review

	/**
	 * @param {{ id: null; street: string; city: string; state: string; zip: string; country: string; }} address
	 */
	function selectSavedAddress(address) {
		selectedAddressId = address.id;
		useNewAddress = false;
		shippingInfo.fullName = user?.name || '';
		shippingInfo.email = user?.email || '';
		shippingInfo.phone = user?.phone || '';
		shippingInfo.street = address.street;
		shippingInfo.city = address.city;
		shippingInfo.state = address.state;
		shippingInfo.zip = address.zip;
		shippingInfo.country = address.country;
	}

	function useNewAddressOption() {
		useNewAddress = true;
		selectedAddressId = null;
		shippingInfo = {
			fullName: user?.name || '',
			email: user?.email || '',
			phone: user?.phone || '',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: 'USA'
		};
	}

	function nextStep() {
		if (currentStep === 1) {
			if (!validateShipping()) return;
			currentStep = 2;
		} else if (currentStep === 2) {
			if (!validatePayment()) return;
			currentStep = 3;
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function validateShipping() {
		if (
			!shippingInfo.fullName ||
			!shippingInfo.email ||
			!shippingInfo.phone ||
			!shippingInfo.street ||
			!shippingInfo.city
		) {
			alert('Please fill in all shipping information');
			return false;
		}
		return true;
	}

	function validatePayment() {
		if (
			!paymentInfo.cardNumber ||
			!paymentInfo.cardName ||
			!paymentInfo.expiryDate ||
			!paymentInfo.cvv
		) {
			alert('Please fill in all payment information');
			return false;
		}
		return true;
	}

	function formatCardNumber(value) {
		return value
			.replace(/\s/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim();
	}

	function handleCardNumberInput(e) {
		let value = e.target.value.replace(/\s/g, '');
		if (value.length <= 16) {
			paymentInfo.cardNumber = formatCardNumber(value);
		}
	}

	function handleExpiryInput(e) {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length >= 2) {
			value = value.slice(0, 2) + '/' + value.slice(2, 4);
		}
		paymentInfo.expiryDate = value;
	}
</script>

<div class="checkout-container">
	<div class="checkout-header">
		<h1>Checkout</h1>
		<div class="steps-indicator">
			<div class="step" class:active={currentStep === 1} class:completed={currentStep > 1}>
				<span class="step-number">1</span>
				<span class="step-label">Shipping</span>
			</div>
			<div class="step-line" class:completed={currentStep > 1}></div>
			<div class="step" class:active={currentStep === 2} class:completed={currentStep > 2}>
				<span class="step-number">2</span>
				<span class="step-label">Payment</span>
			</div>
			<div class="step-line" class:completed={currentStep > 2}></div>
			<div class="step" class:active={currentStep === 3}>
				<span class="step-number">3</span>
				<span class="step-label">Review</span>
			</div>
		</div>
	</div>

	<div class="checkout-content">
		<div class="checkout-main">
			<!-- Step 1: Shipping Information -->
			{#if currentStep === 1}
				<div class="checkout-section">
					<h2>Shipping Information</h2>

					<!-- Saved Addresses -->
					{#if userAddresses.length > 0}
						<div class="saved-addresses-section">
							<h3>Select a saved address</h3>
							<div class="saved-addresses-grid">
								{#each userAddresses as address}
									<div
										class="saved-address-card"
										class:selected={selectedAddressId === address.id && !useNewAddress}
										onclick={() => selectSavedAddress(address)}
									>
										<div class="address-radio">
											{#if selectedAddressId === address.id && !useNewAddress}
												<span class="radio-checked">●</span>
											{:else}
												<span class="radio-unchecked">○</span>
											{/if}
										</div>
										<div class="address-info">
											<div class="address-label-row">
												<strong>{address.label}</strong>
												{#if address.isDefault}
													<span class="mini-badge">Default</span>
												{/if}
											</div>
											<p class="address-compact">
												{address.street}, {address.city}, {address.state}
												{address.zip}
											</p>
										</div>
									</div>
								{/each}

								<!-- Add New Address Option -->
								<div
									class="saved-address-card new-address-option"
									class:selected={useNewAddress}
									onclick={useNewAddressOption}
								>
									<div class="address-radio">
										{#if useNewAddress}
											<span class="radio-checked">●</span>
										{:else}
											<span class="radio-unchecked">○</span>
										{/if}
									</div>
									<div class="address-info">
										<strong>+ Use a different address</strong>
										<p class="address-compact">Enter a new shipping address</p>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Shipping Form -->
					<div class="shipping-form-section">
						{#if userAddresses.length > 0}
							<h3>{useNewAddress ? 'New Shipping Address' : 'Confirm Details'}</h3>
						{/if}

						<div class="form-grid">
							<div class="form-group full-width">
								<label for="fullName">Full Name *</label>
								<input
									type="text"
									id="fullName"
									bind:value={shippingInfo.fullName}
									placeholder="John Doe"
									class="input-field"
								/>
							</div>

							<div class="form-group">
								<label for="email">Email *</label>
								<input
									type="email"
									id="email"
									bind:value={shippingInfo.email}
									placeholder="john@example.com"
									class="input-field"
								/>
							</div>

							<div class="form-group">
								<label for="phone">Phone *</label>
								<input
									type="tel"
									id="phone"
									bind:value={shippingInfo.phone}
									placeholder="+254 712345678"
									class="input-field"
								/>
							</div>

							<div class="form-group full-width">
								<label for="street">Location *</label>
								<input
									type="text"
									id="street"
									bind:value={shippingInfo.street}
									placeholder="Moi Avenue"
									class="input-field"
									disabled={selectedAddressId && !useNewAddress}
								/>
							</div>

							<div class="form-group">
								<label for="city">City *</label>
								<input
									type="text"
									id="city"
									bind:value={shippingInfo.city}
									placeholder="Nairobi"
									class="input-field"
									disabled={selectedAddressId && !useNewAddress}
								/>
							</div>

							<div class="form-group">
								<label for="state">County</label>
								<input
									type="text"
									id="state"
									bind:value={shippingInfo.state}
									placeholder="Nairobi"
									class="input-field"
									disabled={selectedAddressId && !useNewAddress}
								/>
							</div>

							<div class="form-group">
								<label for="zip">ZIP Code</label>
								<input
									type="text"
									id="zip"
									bind:value={shippingInfo.zip}
									placeholder="00200"
									class="input-field"
									disabled={selectedAddressId && !useNewAddress}
								/>
							</div>

							<div class="form-group">
								<label for="country">Country</label>
								<input
									type="text"
									id="country"
									bind:value={shippingInfo.country}
									placeholder="Kenya"
									class="input-field"
									disabled={selectedAddressId && !useNewAddress}
								/>
							</div>
						</div>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={() => goto('/home')}> ← Back to Shopping </button>
						<button class="btn-next" onclick={nextStep}> Continue to Payment → </button>
					</div>
				</div>
			{/if}

			<!-- Step 2: Payment Information -->
			{#if currentStep === 2}
				<div class="checkout-section">
					<h2>Payment Information</h2>
					<div class="form-grid">
						<div class="form-group full-width">
							<label for="cardNumber">Card Number *</label>
							<input
								type="text"
								id="cardNumber"
								value={paymentInfo.cardNumber}
								oninput={handleCardNumberInput}
								placeholder="1234 5678 9012 3456"
								maxlength="19"
								class="input-field"
							/>
						</div>

						<div class="form-group full-width">
							<label for="cardName">Cardholder Name *</label>
							<input
								type="text"
								id="cardName"
								bind:value={paymentInfo.cardName}
								placeholder="John Doe"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="expiryDate">Expiry Date *</label>
							<input
								type="text"
								id="expiryDate"
								value={paymentInfo.expiryDate}
								oninput={handleExpiryInput}
								placeholder="MM/YY"
								maxlength="5"
								class="input-field"
							/>
						</div>

						<div class="form-group">
							<label for="cvv">CVV *</label>
							<input
								type="text"
								id="cvv"
								bind:value={paymentInfo.cvv}
								placeholder="123"
								maxlength="3"
								class="input-field"
							/>
						</div>
					</div>

					<div
						class="form-group checkbox-group"
						style="margin-top: 16px; flex-direction: row; align-items: center; gap: 8px;"
					>
						<input type="checkbox" id="saveCard" bind:checked={paymentInfo.saveCard} />
						<label for="saveCard" style="margin-bottom: 0;"
							>Save card details for future transactions</label
						>
					</div>

					<div class="payment-notice">
						<span class="lock-icon">
							<Lock size={18} />
						</span>
						<p>Your payment information is secure and encrypted</p>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={prevStep}> ← Back to Shipping </button>
						<button class="btn-next" onclick={nextStep}> Review Order → </button>
					</div>
				</div>
			{/if}

			<!-- Step 3: Review Order -->
			{#if currentStep === 3}
				<div class="checkout-section">
					<h2>Review Your Order</h2>

					<div class="review-section">
						<h3>Shipping Information</h3>
						<div class="review-card">
							<p><strong>{shippingInfo.fullName}</strong></p>
							<p>{shippingInfo.email}</p>
							<p>{shippingInfo.phone}</p>
							<p>{shippingInfo.street}</p>
							<p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
							<p>{shippingInfo.country}</p>
							<button class="edit-link" onclick={() => (currentStep = 1)}>Edit</button>
						</div>
					</div>

					<div class="review-section">
						<h3>Payment Method</h3>
						<div class="review-card">
							<p><strong>Card ending in {paymentInfo.cardNumber.slice(-4)}</strong></p>
							<p>{paymentInfo.cardName}</p>
							<p>Expires: {paymentInfo.expiryDate}</p>
							<button class="edit-link" onclick={() => (currentStep = 2)}>Edit</button>
						</div>
					</div>

					<div class="review-section">
						<h3>Order Items</h3>
						<div class="review-items">
							{#each cartItems as item}
								<div class="review-item">
									<div class="item-image-small">
										{#if item.product.image}
											<img src={item.product.image} alt={item.product.name} />
										{:else}
											<div class="placeholder-tiny">No Image</div>
										{/if}
									</div>
									<div class="item-info">
										<p class="item-name">{item.product.name}</p>
										<p class="item-quantity">Qty: {item.quantity}</p>
									</div>
									<p class="item-price">${(item.product.price * item.quantity).toFixed(2)}</p>
								</div>
							{/each}
						</div>
					</div>

					<div class="button-group">
						<button class="btn-back" onclick={prevStep}> ← Back to Payment </button>
						<button class="btn-place-order" onclick={completeOrder}> Place Order </button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Order Summary Sidebar -->
		<div class="checkout-sidebar">
			<div class="summary-card">
				<h3>Order Summary</h3>

				<div class="summary-items">
					{#each cartItems as item}
						<div class="summary-item">
							<span>{item.product.name} × {item.quantity}</span>
							<span>${(item.product.price * item.quantity).toFixed(2)}</span>
						</div>
					{/each}
				</div>

				<div class="summary-divider"></div>

				<div class="summary-row">
					<span>Subtotal</span>
					<span>${total.toFixed(2)}</span>
				</div>

				<div class="summary-row">
					<span>Shipping</span>
					<span>$5.00</span>
				</div>

				<div class="summary-row">
					<span>Tax</span>
					<span>${(total * 0.08).toFixed(2)}</span>
				</div>

				<div class="summary-divider"></div>

				<div class="summary-total">
					<span>Total</span>
					<span>${(total + 5 + total * 0.08).toFixed(2)}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.checkout-container {
		min-height: 100vh;
		background-color: var(--bg-canvas);
		padding: 40px 24px;
	}

	.checkout-header {
		max-width: 1200px;
		margin: 0 auto 40px auto;
	}

	.checkout-header h1 {
		margin: 0 0 32px 0;
		color: var(--text-contrast);
		font-size: 2.25rem;
		text-align: center;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.steps-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.step-number {
		width: 48px;
		height: 48px;
		border-radius: var(--radius-full);
		background-color: var(--bg-subtle);
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.3s;
	}

	.step.active .step-number {
		background-color: var(--text-contrast);
		color: var(--bg-surface);
		border-color: var(--text-contrast);
	}

	.step.completed .step-number {
		background-color: var(--text-contrast);
		color: var(--bg-surface);
		border-color: var(--text-contrast);
	}

	.step-label {
		font-size: 0.875rem;
		color: var(--text-muted);
		font-weight: 500;
	}

	.step.active .step-label {
		color: var(--text-contrast);
		font-weight: 600;
	}

	.step-line {
		width: 100px;
		height: 2px;
		background-color: var(--border-default);
		margin: 0 16px;
		margin-bottom: 24px;
		transition: all 0.3s;
	}

	.step-line.completed {
		background-color: var(--text-contrast);
	}

	.checkout-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		gap: 32px;
		align-items: flex-start;
	}

	.checkout-main {
		flex: 1;
	}

	.checkout-section {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		padding: 40px;
		box-shadow: var(--shadow-subtle);
	}

	.checkout-section h2 {
		margin: 0 0 32px 0;
		color: var(--text-contrast);
		font-size: 1.5rem;
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	/* Saved Addresses Basic Styles */
	.saved-addresses-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
		margin-bottom: 32px;
	}

	.saved-address-card {
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 16px;
		display: flex;
		gap: 16px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.saved-address-card:hover {
		background-color: var(--bg-subtle);
	}

	.saved-address-card.selected {
		border-color: var(--text-contrast);
		background-color: var(--bg-subtle);
	}

	.address-radio {
		color: var(--text-muted);
	}

	.saved-address-card.selected .address-radio {
		color: var(--text-contrast);
	}

	.address-info strong {
		color: var(--text-contrast);
		font-weight: 600;
		font-size: 0.9375rem;
	}

	.address-compact {
		margin: 4px 0 0 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.mini-badge {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		margin-left: 8px;
		color: var(--text-muted);
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
		margin-bottom: 32px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted);
		margin-bottom: 8px;
	}

	.input-field {
		padding: 12px 16px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		color: var(--text-body);
		transition: all 0.2s;
		box-shadow: var(--shadow-subtle);
	}

	.input-field:focus {
		outline: none;
		border-color: var(--border-focus);
		box-shadow: 0 0 0 1px var(--border-focus);
	}

	.input-field:disabled {
		background-color: var(--bg-subtle);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	.payment-notice {
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 32px;
	}

	.lock-icon {
		display: flex;
		align-items: center;
		color: var(--text-muted);
	}

	.payment-notice p {
		margin: 0;
		color: var(--text-body);
		font-weight: 500;
		font-size: 0.9375rem;
	}

	.button-group {
		display: flex;
		gap: 16px;
		justify-content: space-between;
	}

	.btn-back {
		padding: 12px 24px;
		background-color: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-back:hover {
		background-color: var(--bg-subtle);
		color: var(--text-contrast);
		border-color: var(--border-strong);
	}

	.btn-next,
	.btn-place-order {
		padding: 12px 24px;
		background-color: var(--accent-primary);
		color: #ffffff;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
		max-width: 300px;
		box-shadow: var(--shadow-subtle);
	}

	.btn-next:hover,
	.btn-place-order:hover:not(:disabled) {
		background-color: var(--accent-hover);
	}

	.btn-place-order:active:not(:disabled) {
		transform: scale(0.98);
	}

	.btn-place-order:disabled {
		background-color: var(--border-default);
		color: var(--text-muted);
		cursor: not-allowed;
	}

	/* Review Section */
	.review-section {
		margin-bottom: 32px;
	}

	.review-section h3 {
		margin: 0 0 16px 0;
		color: var(--text-contrast);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.review-card {
		background-color: var(--bg-subtle);
		padding: 24px;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-subtle);
		position: relative;
	}

	.review-card p {
		margin: 0 0 8px 0;
		color: var(--text-body);
		line-height: 1.5;
		font-size: 0.9375rem;
	}

	.review-card p strong {
		color: var(--text-contrast);
	}

	.edit-link {
		position: absolute;
		top: 24px;
		right: 24px;
		background: none;
		border: none;
		color: var(--text-muted);
		font-weight: 500;
		cursor: pointer;
		text-decoration: underline;
		font-size: 0.875rem;
	}

	.edit-link:hover {
		color: var(--text-contrast);
	}

	.review-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.review-item {
		display: flex;
		align-items: center;
		gap: 16px;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-subtle);
		padding: 16px;
		border-radius: var(--radius-md);
	}

	.item-image-small {
		width: 48px;
		height: 48px;
		background-color: var(--bg-surface);
		border-radius: var(--radius-sm);
		overflow: hidden;
		flex-shrink: 0;
		border: 1px solid var(--border-default);
	}

	.item-image-small img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-tiny {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-subtle);
		font-size: 0.625rem;
	}

	.item-info {
		flex: 1;
	}

	.item-name {
		margin: 0 0 4px 0;
		color: var(--text-contrast);
		font-weight: 500;
		font-size: 0.9375rem;
	}

	.item-quantity {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.item-price {
		margin: 0;
		color: var(--text-contrast);
		font-weight: 600;
		font-size: 1rem;
	}

	/* Sidebar */
	.checkout-sidebar {
		flex: 0 0 380px;
		position: sticky;
		top: 40px;
	}

	.summary-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		padding: 32px;
		box-shadow: var(--shadow-subtle);
	}

	.summary-card h3 {
		margin: 0 0 24px 0;
		color: var(--text-contrast);
		font-size: 1.25rem;
		font-weight: 600;
	}

	.summary-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 24px;
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		color: var(--text-muted);
		font-size: 0.9375rem;
	}

	.summary-divider {
		height: 1px;
		background-color: var(--border-default);
		margin: 20px 0;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16px;
		color: var(--text-body);
		font-size: 0.9375rem;
	}

	.summary-total {
		display: flex;
		justify-content: space-between;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-contrast);
		margin-top: 24px;
	}

	.summary-total span:last-child {
		color: var(--accent-primary);
		font-size: 1.5rem;
		font-weight: 700;
	}

	/* Responsive */
	@media (max-width: 968px) {
		.checkout-content {
			flex-direction: column;
		}

		.checkout-sidebar {
			flex: 1;
			position: static;
			width: 100%;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.step-line {
			width: 40px;
			margin: 0 12px;
		}

		.step-label {
			display: none;
		}
	}

	@media (max-width: 568px) {
		.checkout-container {
			padding: 24px 16px;
		}

		.checkout-section {
			padding: 24px;
		}

		.checkout-header h1 {
			font-size: 2rem;
		}

		.button-group {
			flex-direction: column;
		}

		.btn-next,
		.btn-place-order {
			max-width: 100%;
		}

		.step-number {
			width: 40px;
			height: 40px;
			font-size: 1rem;
		}
	}
</style>
