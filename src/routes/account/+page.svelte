<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { currentUser } from '../../stores/user.js';
	import { addresses } from '../../stores/addresses.js';
	import { wishlist } from '../../stores/wishlist.js';
	import { cart, isCartOpen } from '../../stores/cart.js';
	import { Heart, MapPin, Package, CreditCard } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';

	let user = $state(null);
	/**
	 * @type {string | any[] | null | undefined}
	 */
	let userAddresses = $state([]);
	let wishlistItems = $state([]);
	let { data } = $props();
	let userOrders = $derived(data?.orders || []);
	let userCards = $derived(data?.cards || []);

	$effect(() => {
		if (data?.addresses) {
			addresses.set(data.addresses);
		}
	});

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
			if (!u) {
				goto('/login');
			} else if (u && typeof window !== 'undefined' && !window.location.search) {
				goto(`/account?userId=${u._id}`, { replaceState: true, noScroll: true });
			}
		});
	});

	$effect(() => {
		addresses.subscribe((addrs) => {
			userAddresses = addrs;
		});
	});

	$effect(() => {
		wishlist.subscribe((items) => {
			wishlistItems = items;
		});
	});

	function addToCartFromWishlist(product) {
		cart.addItem(product, 1);
		isCartOpen.set(true);
	}

	function removeFromWishlist(productId) {
		wishlist.removeItem(productId);
	}

	let isEditingProfile = $state(false);
	let isEditingPassword = $state(false);
	let isAddingAddress = $state(false);
	let editingAddressId = $state(null);
	let isAddingCard = $state(false);
	let editingCardId = $state(null);

	let profileForm = $state({
		name: '',
		email: '',
		phone: ''
	});

	let newAddress = $state({
		label: 'Home',
		street: '',
		city: '',
		state: '',
		zip: '',
		country: 'Kenya'
	});

	let newCard = $state({
		cardNumber: '',
		cardName: '',
		expiryDate: '',
		cvv: ''
	});

	// Map related
	let map = $state(null);
	let marker = $state(null);
	let mapContainer = $state(null);

	$effect(() => {
		if (user) {
			profileForm = {
				name: user.name || '',
				email: user.email || '',
				phone: user.phone || ''
			};
		}
	});

	function handleLogout() {
		currentUser.logout();
		goto('/login');
	}

	async function saveProfile() {
		if (user) {
			const formData = new FormData();
			formData.append('userId', user._id);
			formData.append('name', profileForm.name);
			formData.append('email', profileForm.email);
			formData.append('phone', profileForm.phone);

			const response = await fetch('?/updateProfile', { method: 'POST', body: formData });
			const result = await response.json();

			if (result.success) {
				currentUser.set({ ...user, ...profileForm });
				isEditingProfile = false;
			}
		}
	}

	function startAddingAddress() {
		isAddingAddress = true;
		editingAddressId = null;
		newAddress = {
			label: 'Home',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: 'USA'
		};
		setTimeout(initMap, 100);
	}

	function startEditingAddress(address) {
		editingAddressId = address.id;
		newAddress = { ...address };
		isAddingAddress = true;
		setTimeout(initMap, 100);
	}

	function cancelAddressForm() {
		isAddingAddress = false;
		editingAddressId = null;
		newAddress = {
			label: 'Home',
			street: '',
			city: '',
			state: '',
			zip: '',
			country: 'USA'
		};
	}

	async function saveAddress() {
		if (!newAddress.street || !newAddress.city) {
			alert('Please fill in all required fields');
			return;
		}

		if (!user) return;

		const formData = new FormData();
		formData.append('userId', user._id);

		if (editingAddressId) {
			formData.append('addressId', editingAddressId);
			formData.append('updates', JSON.stringify(newAddress));
			await fetch('?/updateAddress', { method: 'POST', body: formData });
		} else {
			formData.append('address', JSON.stringify(newAddress));
			await fetch('?/addAddress', { method: 'POST', body: formData });
		}

		// Reload addresses
		// const response = await fetch(`/account?userId=${user._id}`);
		// const html = await response.text();
		// location.reload();
		await invalidateAll();
		cancelAddressForm();
	}

	/**
	 * @param {any} id
	 */
	async function deleteAddress(id) {
		if (!user) return;
		if (confirm('Are you sure you want to delete this address?')) {
			const formData = new FormData();
			formData.append('addressId', id);
			await fetch('?/deleteAddress', { method: 'POST', body: formData });
			// location.reload();
			await invalidateAll();
		}
	}

	/**
	 * @param {any} id
	 */
	async function setDefaultAddress(id) {
		if (!user) return;
		const formData = new FormData();
		formData.append('addressId', id);
		formData.append('userId', user._id);
		await fetch('?/setDefault', { method: 'POST', body: formData });
		await invalidateAll();
	}

	function startAddingCard() {
		isAddingCard = true;
		editingCardId = null;
		newCard = {
			cardNumber: '',
			cardName: '',
			expiryDate: '',
			cvv: ''
		};
	}

	function startEditingCard(card) {
		editingCardId = card._id;
		newCard = { ...card };
		isAddingCard = true;
	}

	function cancelCardForm() {
		isAddingCard = false;
		editingCardId = null;
		newCard = {
			cardNumber: '',
			cardName: '',
			expiryDate: '',
			cvv: ''
		};
	}

	async function saveCard() {
		if (!newCard.cardNumber || !newCard.cardName || !newCard.expiryDate) {
			alert('Please fill in all required fields');
			return;
		}
		if (!user) return;

		const formData = new FormData();
		formData.append('userId', user._id);

		if (editingCardId) {
			formData.append('cardId', editingCardId);
			formData.append('updates', JSON.stringify(newCard));
			await fetch('?/updateCard', { method: 'POST', body: formData });
		} else {
			formData.append('card', JSON.stringify(newCard));
			await fetch('?/addCard', { method: 'POST', body: formData });
		}

		await invalidateAll();
		cancelCardForm();
	}

	async function deleteCard(id) {
		if (!user) return;
		if (confirm('Are you sure you want to delete this card?')) {
			const formData = new FormData();
			formData.append('cardId', id);
			await fetch('?/deleteCard', { method: 'POST', body: formData });
			await invalidateAll();
		}
	}

	async function setDefaultCard(id) {
		if (!user) return;
		const formData = new FormData();
		formData.append('cardId', id);
		formData.append('userId', user._id);
		await fetch('?/setDefaultCard', { method: 'POST', body: formData });
		await invalidateAll();
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
			newCard.cardNumber = formatCardNumber(value);
		}
	}

	function handleExpiryInput(e) {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length >= 2) {
			value = value.slice(0, 2) + '/' + value.slice(2, 4);
		}
		newCard.expiryDate = value;
	}

	async function initMap() {
		if (!mapContainer) return;

		// Dynamically import Leaflet
		const L = await import('leaflet');
		await import('leaflet/dist/leaflet.css');

		// Initialize map
		if (map) {
			map.remove();
		}

		map = L.map(mapContainer).setView([40.7128, -74.006], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		// Add marker
		marker = L.marker([40.7128, -74.006], {
			draggable: true
		}).addTo(map);

		// Update address when marker is dragged
		marker.on('dragend', async function (e) {
			const position = marker.getLatLng();
			// Reverse geocoding
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
				);
				const data = await response.json();
				if (data.address) {
					newAddress.street = data.address.road || data.address.suburb || '';
					newAddress.city = data.address.city || data.address.town || data.address.village || '';
					newAddress.state = data.address.state || '';
					newAddress.zip = data.address.postcode || '';
					newAddress.country = data.address.country || 'USA';
				}
			} catch (error) {
				console.error('Geocoding error:', error);
			}
		});
	}

	async function searchAddress() {
		const query = `${newAddress.street}, ${newAddress.city}, ${newAddress.state}`;
		if (!query.trim()) return;

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
			);
			const data = await response.json();
			if (data && data.length > 0) {
				const L = await import('leaflet');
				const lat = parseFloat(data[0].lat);
				const lon = parseFloat(data[0].lon);
				map.setView([lat, lon], 15);
				marker.setLatLng([lat, lon]);
			}
		} catch (error) {
			console.error('Search error:', error);
		}
	}
</script>

{#if user}
	<div class="account-container">
		<div class="account-header">
			<div class="header-content">
				<div class="user-avatar">
					<span class="avatar-text"
						>{user.name
							.split(' ')
							.map((n) => n[0])
							.join('')}</span
					>
				</div>
				<div class="user-info">
					<h1>{user.name}</h1>
					<p>@{user.username}</p>
				</div>
			</div>
		</div>

		<div class="account-content">
			<div class="main-content">
				<!-- Profile Information -->
				<section class="content-card">
					<div class="card-header">
						<h2>Profile Information</h2>
						<button class="edit-btn" onclick={() => (isEditingProfile = !isEditingProfile)}>
							{isEditingProfile ? 'Cancel' : 'Edit'}
						</button>
					</div>
					<div class="card-body">
						<div class="info-grid">
							<div class="info-item">
								<label>Full Name</label>
								{#if isEditingProfile}
									<input type="text" bind:value={profileForm.name} class="edit-input" />
								{:else}
									<p>{user.name}</p>
								{/if}
							</div>
							<div class="info-item">
								<label>Email</label>
								{#if isEditingProfile}
									<input type="email" bind:value={profileForm.email} class="edit-input" />
								{:else}
									<p>{user.email}</p>
								{/if}
							</div>
							<div class="info-item">
								<label>Phone</label>
								{#if isEditingProfile}
									<input type="tel" bind:value={profileForm.phone} class="edit-input" />
								{:else}
									<p>{user.phone || 'Not provided'}</p>
								{/if}
							</div>
						</div>
						{#if isEditingProfile}
							<div class="action-buttons">
								<button class="save-btn" onclick={saveProfile}>Save Changes</button>
								<button class="cancel-btn" onclick={() => (isEditingProfile = false)}>Cancel</button
								>
							</div>
						{/if}
					</div>
				</section>

				<!-- Addresses Section -->
				<section class="content-card" id="addresses">
					<div class="card-header">
						<h2>Saved Addresses</h2>
						{#if !isAddingAddress}
							<button class="edit-btn" onclick={startAddingAddress}> + Add Address </button>
						{/if}
					</div>
					<div class="card-body">
						{#if isAddingAddress}
							<div class="address-form">
								<h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>

								<div class="form-grid">
									<div class="form-group">
										<label for="label">Label</label>
										<select id="label" bind:value={newAddress.label} class="edit-input">
											<option value="Home">Home</option>
											<option value="Work">Work</option>
											<option value="Other">Other</option>
										</select>
									</div>

									<div class="form-group full-width">
										<label for="street">Location Name: *</label>
										<input
											type="text"
											id="street"
											bind:value={newAddress.street}
											placeholder="Moi Avenue"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="city">City *</label>
										<input
											type="text"
											id="city"
											bind:value={newAddress.city}
											placeholder="New York"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="state">County</label>
										<input
											type="text"
											id="state"
											bind:value={newAddress.state}
											placeholder="Nairobi"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="zip">ZIP Code</label>
										<input
											type="text"
											id="zip"
											bind:value={newAddress.zip}
											placeholder="00200"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="country">Country</label>
										<input
											type="text"
											id="country"
											bind:value={newAddress.country}
											placeholder="Kenya"
											class="edit-input"
										/>
									</div>
								</div>

								<button class="search-map-btn" onclick={searchAddress}>
									<MapPin size={16} />
									<span>Find on Map</span>
								</button>

								<div class="map-container" bind:this={mapContainer}></div>
								<p class="map-hint">Drag the marker to adjust the location</p>

								<div class="action-buttons">
									<button class="save-btn" onclick={saveAddress}>
										{editingAddressId ? 'Update Address' : 'Save Address'}
									</button>
									<button class="cancel-btn" onclick={cancelAddressForm}>Cancel</button>
								</div>
							</div>
						{:else if userAddresses.length === 0}
							<div class="empty-state">
								<span class="empty-icon">
									<MapPin size={40} color="#bbb" />
								</span>
								<p>No addresses saved yet</p>
								<button class="add-first-btn" onclick={startAddingAddress}>
									Add Your First Address
								</button>
							</div>
						{:else}
							<div class="addresses-list">
								{#each userAddresses as address}
									<div class="address-item">
										<div class="address-content">
											<div class="address-header-row">
												<h4>{address.label}</h4>
												{#if address.isDefault}
													<span class="default-badge">Default</span>
												{/if}
											</div>
											<p class="address-text">
												{address.street}<br />
												{address.city}, {address.state}
												{address.zip}<br />
												{address.country}
											</p>
										</div>
										<div class="address-actions">
											<button class="action-link" onclick={() => startEditingAddress(address)}>
												Edit
											</button>
											{#if !address.isDefault}
												<button class="action-link" onclick={() => setDefaultAddress(address.id)}>
													Set as Default
												</button>
											{/if}
											<button class="action-link delete" onclick={() => deleteAddress(address.id)}>
												Delete
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>

				<!-- Payment Methods Section -->
				<section class="content-card" id="cards">
					<div class="card-header">
						<h2>Saved Cards</h2>
						{#if !isAddingCard}
							<button class="edit-btn" onclick={startAddingCard}> + Add Card </button>
						{/if}
					</div>
					<div class="card-body">
						{#if isAddingCard}
							<div class="address-form">
								<h3>{editingCardId ? 'Edit Card' : 'Add New Card'}</h3>

								<div class="form-grid">
									<div class="form-group full-width">
										<label for="cardNumber">Card Number *</label>
										<input
											type="text"
											id="cardNumber"
											value={newCard.cardNumber}
											oninput={handleCardNumberInput}
											placeholder="1234 5678 9012 3456"
											maxlength="19"
											class="edit-input"
										/>
									</div>

									<div class="form-group full-width">
										<label for="cardName">Cardholder Name *</label>
										<input
											type="text"
											id="cardName"
											bind:value={newCard.cardName}
											placeholder="John Doe"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="expiryDate">Expiry Date *</label>
										<input
											type="text"
											id="expiryDate"
											value={newCard.expiryDate}
											oninput={handleExpiryInput}
											placeholder="MM/YY"
											maxlength="5"
											class="edit-input"
										/>
									</div>

									<div class="form-group">
										<label for="cvv">CVV *</label>
										<input
											type="text"
											id="cvv"
											bind:value={newCard.cvv}
											placeholder="123"
											maxlength="3"
											class="edit-input"
										/>
									</div>
								</div>

								<div class="action-buttons">
									<button class="save-btn" onclick={saveCard}>Save Card</button>
									<button class="cancel-btn" onclick={cancelCardForm}>Cancel</button>
								</div>
							</div>
						{:else if userCards.length === 0}
							<div class="empty-state">
								<span class="empty-icon">
									<CreditCard size={40} color="#bbb" />
								</span>
								<p>No payment methods saved yet</p>
								<button class="add-first-btn" onclick={startAddingCard}>
									Add Your First Card
								</button>
							</div>
						{:else}
							<div class="addresses-list">
								{#each userCards as card}
									<div class="address-item">
										<div class="address-content">
											<div class="address-header-row">
												<h4>{card.cardName}</h4>
												{#if card.isDefault}
													<span class="default-badge">Default</span>
												{/if}
											</div>
											<p class="address-text">
												Card ending in {card.cardNumber.slice(-4)}<br />
												Expires {card.expiryDate}
											</p>
										</div>
										<div class="address-actions">
											<button class="action-link" onclick={() => startEditingCard(card)}>
												Edit
											</button>
											{#if !card.isDefault}
												<button class="action-link" onclick={() => setDefaultCard(card._id)}>
													Set as Default
												</button>
											{/if}
											<button class="action-link delete" onclick={() => deleteCard(card._id)}>
												Delete
											</button>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>

				<!-- Orders Section -->
				<section class="content-card" id="orders">
					<div class="card-header">
						<h2>My Orders</h2>
						<span class="orders-count"
							>{userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}</span
						>
					</div>
					<div class="card-body">
						{#if userOrders.length === 0}
							<div class="empty-state">
								<span class="empty-icon">
									<Package size={40} color="#bbb" />
								</span>
								<p>No orders placed yet</p>
								<a href="/home" class="add-first-btn">Start Shopping</a>
							</div>
						{:else}
							<div class="orders-list">
								{#each userOrders as order}
									<div class="order-card">
										<div class="order-card-header">
											<div class="order-header-left">
												<span class="order-id-badge">{order.orderId}</span>
												<span class="order-date-text">
													{new Date(order.date || order.createdAt).toLocaleDateString()}
												</span>
											</div>
											<div class="order-header-right">
												<span class="order-total-amount">${order.total}</span>
												<a href={`/order/${order.orderId}`} class="view-order-link"
													>View Receipt →</a
												>
											</div>
										</div>

										<div class="order-items-preview">
											{#each order.items as item}
												<div class="order-item-row">
													<span class="item-name">{item.product.name} × {item.quantity}</span>
													<span class="item-price"
														>${(item.product.price * item.quantity).toFixed(2)}</span
													>
												</div>
											{/each}
										</div>

										<div class="order-card-footer">
											<span class="shipping-dest">
												<MapPin size={14} />
												<span
													>Shipping to: {order.shipping?.fullName || ''}, {order.shipping?.city ||
														''}</span
												>
											</span>
											<span class="order-status-badge">Completed</span>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>

				<!-- Wishlist Section -->
				<section class="content-card" id="wishlist">
					<div class="card-header">
						<h2>My Wishlist</h2>
						<span class="orders-count"
							>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</span
						>
					</div>
					<div class="card-body">
						{#if wishlistItems.length === 0}
							<div class="empty-state">
								<span class="empty-icon">
									<Heart size={40} color="#bbb" />
								</span>
								<p>Your wishlist is empty</p>
								<a href="/home" class="add-first-btn">Explore Products</a>
							</div>
						{:else}
							<div class="wishlist-grid">
								{#each wishlistItems as item (item.id)}
									<div class="wishlist-card">
										<a href={`/product/${item.id}`} class="wishlist-image-wrap">
											{#if item.image}
												<img src={item.image} alt={item.name} class="wishlist-card-img" />
											{:else}
												<div class="wishlist-no-img">No Image</div>
											{/if}
										</a>
										<div class="wishlist-card-body">
											<span class="wishlist-category">{item.category}</span>
											<a href={`/product/${item.id}`} class="wishlist-title">{item.name}</a>
											<span class="wishlist-price">${item.price.toFixed(2)}</span>
											<div class="wishlist-btns">
												<button
													type="button"
													class="wishlist-cart-btn"
													onclick={() => addToCartFromWishlist(item)}
												>
													Add to Cart
												</button>
												<button
													type="button"
													class="wishlist-del-btn"
													onclick={() => removeFromWishlist(item.id)}
													title="Remove from wishlist"
												>
													Remove
												</button>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</section>
			</div>
		</div>
	</div>
{/if}

<style>
	.account-container {
		min-height: 100vh;
		background-color: var(--bg-canvas);
	}

	.account-header {
		background-color: #fff4ed;
		border-bottom: 1px solid #ffdcd0;
		color: var(--text-contrast);
		padding: 60px 40px;
		position: relative;
	}

	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 24px;
		position: relative;
		z-index: 1;
	}

	.user-avatar {
		width: 100px;
		height: 100px;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-full);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text-muted);
	}

	.user-info h1 {
		margin: 0 0 8px 0;
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.025em;
	}

	.user-info p {
		margin: 0 0 8px 0;
		color: var(--text-muted);
		font-size: 1.1rem;
	}

	.account-content {
		max-width: 1200px;
		margin: -40px auto 40px auto;
		padding: 0 40px;
		display: flex;
		gap: 32px;
		position: relative;
		z-index: 2;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.content-card {
		background-color: var(--bg-surface);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border-default);
		box-shadow: var(--shadow-subtle);
		overflow: hidden;
	}

	.card-header {
		padding: 24px 32px;
		border-bottom: 1px solid var(--border-default);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--text-contrast);
		font-weight: 600;
	}

	.edit-btn {
		color: var(--text-muted);
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 500;
		transition: color 0.2s;
		font-size: 0.875rem;
	}

	.edit-btn:hover {
		color: var(--text-contrast);
	}

	.card-body {
		padding: 32px;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 24px;
	}

	.info-item label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-muted);
		margin-bottom: 8px;
	}

	.info-item p {
		margin: 0;
		color: var(--text-body);
		font-size: 1rem;
	}

	.edit-input {
		width: 100%;
		padding: 12px 16px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		color: var(--text-body);
		transition: all 0.2s;
		box-sizing: border-box;
		box-shadow: var(--shadow-subtle);
	}

	.edit-input:focus {
		outline: none;
		border-color: var(--border-focus);
		box-shadow: 0 0 0 1px var(--border-focus);
	}

	.action-buttons {
		margin-top: 24px;
		display: flex;
		gap: 12px;
	}

	.save-btn {
		background-color: var(--text-contrast);
		color: var(--bg-surface);
		border: none;
		padding: 12px 24px;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.save-btn:hover {
		background-color: var(--text-body);
	}

	.cancel-btn {
		background-color: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		padding: 12px 24px;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.cancel-btn:hover {
		color: var(--text-contrast);
		background-color: var(--bg-subtle);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60px 20px;
		text-align: center;
	}

	.empty-icon {
		margin-bottom: 16px;
		color: var(--text-subtle);
	}

	.empty-state p {
		color: var(--text-muted);
		font-size: 1rem;
		margin: 0 0 24px 0;
	}

	.add-first-btn {
		background-color: var(--text-contrast);
		color: var(--bg-surface);
		border: none;
		padding: 12px 24px;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
		transition: background-color 0.2s;
	}

	.add-first-btn:hover {
		background-color: var(--text-body);
	}

	/* Address Styles */
	.address-form {
		background-color: var(--bg-subtle);
		padding: 32px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-subtle);
	}

	.address-form h3 {
		margin: 0 0 24px 0;
		color: var(--text-contrast);
		font-size: 1.125rem;
		font-weight: 600;
	}

	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
		margin-bottom: 24px;
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

	.map-container {
		width: 100%;
		height: 300px;
		border-radius: var(--radius-md);
		margin: 16px 0;
		border: 1px solid var(--border-default);
	}

	.map-hint {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.875rem;
		margin: 8px 0 20px 0;
	}

	.search-map-btn {
		width: 100%;
		background-color: transparent;
		color: var(--text-body);
		border: 1px solid var(--border-default);
		padding: 12px;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}

	.search-map-btn:hover {
		background-color: var(--bg-surface);
		color: var(--text-contrast);
	}

	.addresses-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.address-item {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		padding: 24px;
		border-radius: var(--radius-md);
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 20px;
	}

	.address-content {
		flex: 1;
	}

	.address-header-row {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.address-item h4 {
		margin: 0;
		color: var(--text-contrast);
		font-size: 1rem;
		font-weight: 600;
	}

	.default-badge {
		background-color: var(--bg-subtle);
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		padding: 4px 12px;
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 500;
	}

	.address-text {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.5;
		font-size: 0.9375rem;
	}

	.address-actions {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-end;
	}

	.action-link {
		background: none;
		border: none;
		color: var(--text-muted);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		padding: 4px 8px;
		transition: color 0.2s;
	}

	.action-link:hover {
		color: var(--text-contrast);
	}

	.action-link.delete:hover {
		color: var(--color-destructive);
	}

	/* Orders Styles */
	.orders-count {
		color: var(--text-muted);
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.orders-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.order-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.order-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		border-bottom: 1px solid var(--border-default);
		padding-bottom: 16px;
	}

	.order-header-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.order-id-badge {
		font-family: monospace;
		font-weight: 600;
		color: var(--text-contrast);
		background-color: var(--bg-subtle);
		border: 1px solid var(--border-default);
		padding: 4px 10px;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
	}

	.order-date-text {
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.order-header-right {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.order-total-amount {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-contrast);
	}

	.view-order-link {
		color: var(--text-muted);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.view-order-link:hover {
		color: var(--text-contrast);
		text-decoration: underline;
	}

	.order-items-preview {
		display: flex;
		flex-direction: column;
		gap: 8px;
		background-color: var(--bg-subtle);
		border-radius: var(--radius-md);
		padding: 16px;
		border: 1px solid var(--border-subtle);
	}

	.order-item-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.9375rem;
		color: var(--text-body);
	}

	.order-card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
		color: var(--text-muted);
		flex-wrap: wrap;
		gap: 8px;
	}

	.shipping-dest {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.order-status-badge {
		background-color: var(--bg-subtle);
		color: var(--color-success);
		font-weight: 500;
		padding: 4px 12px;
		border-radius: var(--radius-full);
		font-size: 0.8125rem;
		border: 1px solid var(--border-default);
	}

	/* Wishlist Styles */
	.wishlist-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 24px;
	}

	.wishlist-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.wishlist-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-subtle);
		border-color: var(--border-strong);
	}

	.wishlist-image-wrap {
		background-color: var(--bg-canvas);
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		text-decoration: none;
		border-bottom: 1px solid var(--border-subtle);
	}

	.wishlist-card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.wishlist-no-img {
		color: var(--text-subtle);
		font-size: 0.875rem;
	}

	.wishlist-card-body {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.wishlist-category {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.wishlist-title {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-contrast);
		text-decoration: none;
		line-height: 1.4;
	}

	.wishlist-price {
		font-size: 1rem;
		font-weight: 600;
		color: var(--accent-primary);
		margin: 4px 0 12px 0;
	}

	.wishlist-btns {
		display: flex;
		gap: 8px;
		margin-top: auto;
	}

	.wishlist-cart-btn {
		flex: 1;
		background-color: var(--accent-primary);
		color: #ffffff;
		border: none;
		padding: 10px 12px;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.2s,
			transform 0.1s ease;
	}

	.wishlist-cart-btn:hover {
		background-color: var(--accent-hover);
	}

	.wishlist-cart-btn:active {
		transform: scale(0.98);
	}

	.wishlist-del-btn {
		background-color: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-default);
		padding: 10px 12px;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.wishlist-del-btn:hover {
		background-color: var(--color-destructive-bg);
		color: var(--color-destructive);
		border-color: var(--color-destructive);
	}

	@media (max-width: 968px) {
		.account-content {
			flex-direction: column;
		}
		.account-header {
			padding: 40px 30px;
		}

		.account-content {
			padding: 0 30px;
		}

		.form-grid {
			grid-template-columns: 1fr;
		}

		.address-item {
			flex-direction: column;
		}

		.address-actions {
			width: 100%;
			flex-direction: row;
			justify-content: flex-start;
		}
	}

	@media (max-width: 568px) {
		.header-content {
			flex-direction: column;
			text-align: center;
		}

		.user-avatar {
			width: 80px;
			height: 80px;
			font-size: 2rem;
		}

		.user-info h1 {
			font-size: 1.5rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			flex-direction: column;
		}

		.save-btn,
		.cancel-btn {
			width: 100%;
		}
	}
</style>
