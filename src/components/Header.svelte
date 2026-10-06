<script>
	import Button from './Button.svelte';
	import { currentUser } from '../stores/user.js';
	import { cart, isCartOpen } from '../stores/cart.js';
	import { goto } from '$app/navigation';

	let user = $state(null);
	let cartItems = $state([]);

	$effect(() => {
		currentUser.subscribe((u) => {
			user = u;
		});
	});

	$effect(() => {
		cart.subscribe((items) => {
			cartItems = items;
		});
	});

	let cartCount = $derived(cartItems.reduce((sum, item) => sum + item.quantity, 0));

	function handleLogout() {
		currentUser.logout();
		goto('/login');
	}

	function openCart() {
		isCartOpen.set(true);
	}
</script>

<header>
	<nav>
		<ul class="header-content">
			<li class="business"><a href="/home">MERCADO A LA TECHNOLOGIA</a></li>
			<div class="nav-links">
				<button class="btn-cart" onclick={openCart}>
					Cart
					{#if cartCount > 0}
						<span class="cart-badge">{cartCount}</span>
					{/if}
				</button>
				<a href="/home">Home</a>
				{#if user}
					<a href="/account">Manage Account</a>
					<span class="user-greeting">Hello, {user.name.split(' ')[0]}</span>
					<button class="btn-logout" onclick={handleLogout}>Logout</button>
				{:else}
					<a href="/login">Sign In</a>
					<a href="/register" class="btn-register">Get Started</a>
				{/if}
			</div>
		</ul>
	</nav>
</header>

<style>
	header {
		background-color: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-default);
		position: sticky;
		top: 0;
		z-index: 50;
	}
	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		list-style: none;
		margin: 0 auto;
		max-width: 1200px;
		padding: 16px 24px;
	}
	.business {
		font-size: 1.125rem;
		white-space: nowrap;
	}
	.business a {
		color: var(--accent-primary);
		font-weight: 700;
		letter-spacing: -0.025em;
		text-decoration: none;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.nav-links a {
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 500;
		font-size: 0.875rem;
		transition: color 0.2s;
	}
	.nav-links a:hover {
		color: var(--text-contrast);
	}
	.btn-register {
		background-color: var(--text-contrast) !important;
		color: var(--bg-surface) !important;
		padding: 8px 16px !important;
		border-radius: var(--radius-md) !important;
	}
	.btn-register:hover {
		background-color: var(--text-body) !important;
	}
	.user-greeting {
		color: var(--text-muted);
		font-weight: 500;
		font-size: 0.875rem;
	}
	.btn-logout {
		background: #fff4ed;
		color: var(--accent-primary);
		border: 1px solid #ffdcd0;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		padding: 6px 12px;
		border-radius: var(--radius-md);
	}
	.btn-logout:hover {
		background: var(--accent-primary);
		color: #ffffff;
		border-color: var(--accent-primary);
	}
	.btn-cart {
		background: var(--bg-surface);
		border: 1px solid var(--border-default);
		color: var(--text-body);
		padding: 6px 12px;
		border-radius: var(--radius-full);
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.2s;
		font-size: 0.875rem;
		box-shadow: var(--shadow-subtle);
	}
	.btn-cart:hover {
		border-color: var(--border-strong);
		background-color: var(--bg-subtle);
	}
	.cart-badge {
		background-color: var(--accent-primary);
		color: #ffffff;
		border-radius: var(--radius-full);
		padding: 2px 6px;
		font-size: 0.6875rem;
		font-weight: 600;
		line-height: 1;
	}
</style>
