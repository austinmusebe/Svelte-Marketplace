<script>
	import { currentAdmin } from '../../stores/admin.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();

	// Handle successful login
	$effect(() => {
		if (form?.success) {
			currentAdmin.set({ username: 'admin', role: 'admin' });
			goto('/admin-dashboard');
		}
	});
</script>

<div class="auth-wrapper">
	<div class="auth-card">
		<div class="details">
			<h1>Admin Portal</h1>
			<p class="subtitle">Secure access to dashboard and analytics</p>
			<p><a href="/login">← Back to User Login</a></p>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<form method="POST" use:enhance>
				<div class="input-group">
					<label for="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						placeholder="Enter admin username"
						class="user-pass"
					/>
				</div>

				<div class="input-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Enter admin password"
						class="user-pass"
					/>
				</div>

				<div class="button-container">
					<button type="submit" class="login-btn">Admin Login</button>
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	.auth-wrapper {
		display: grid;
		place-items: center;
		min-height: calc(100vh - 80px);
		background-color: var(--bg-canvas);
		padding: 20px;
		width: 100%;
	}

	.auth-card {
		width: 100%;
		max-width: 440px;
		background-color: var(--bg-surface);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-card);
		padding: 40px;
	}

	.details {
		width: 100%;
	}

	h1 {
		font-size: 1.75rem;
		color: var(--text-contrast);
		margin: 0 0 8px 0;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-align: center;
	}

	p {
		font-size: 0.9375rem;
		color: var(--text-muted);
		margin: 0 0 24px 0;
		text-align: center;
	}

	p.subtitle {
		margin: 0 0 8px 0;
		color: var(--text-body);
	}

	a {
		color: var(--accent-primary);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	a:hover {
		color: var(--accent-hover);
	}

	form {
		width: 100%;
	}

	.error-message {
		background-color: var(--color-destructive-bg);
		color: var(--color-destructive);
		padding: 12px;
		border-radius: var(--radius-md);
		margin-bottom: 20px;
		font-size: 0.875rem;
		border: 1px solid rgba(220, 38, 38, 0.2);
	}

	.input-group {
		margin-bottom: 16px;
	}

	label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-body);
		margin-bottom: 8px;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		background-color: var(--bg-surface);
		color: var(--text-contrast);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		font-size: 0.9375rem;
		transition: all 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: var(--border-focus);
		box-shadow: 0 0 0 1px var(--border-focus);
	}

	input::placeholder {
		color: var(--text-subtle);
	}

	.button-container {
		margin-top: 24px;
	}

	.login-btn {
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
		box-shadow: var(--shadow-subtle);
	}

	.login-btn:hover {
		background-color: var(--accent-hover);
	}

	.login-btn:active {
		transform: scale(0.98);
	}

	@media (max-width: 568px) {
		.auth-card {
			padding: 24px;
		}
	}
</style>
