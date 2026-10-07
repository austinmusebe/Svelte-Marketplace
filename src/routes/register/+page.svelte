<script>
	import { currentUser } from '../../stores/user.js';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { form } = $props();
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let username = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');

	// Handle successful registration
	$effect(() => {
		if (form?.success && form?.user) {
			currentUser.set(form.user);
			goto('/home');
		}
	});
</script>

<div class="auth-wrapper">
	<div class="auth-card">
		<div class="details">
			<h1>Create Account</h1>
			<p>Already have an account? <a href="/login">Sign in</a></p>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<form method="POST" use:enhance>
				<div class="name-section">
					<div class="input-group">
						<label for="firstName">First Name</label>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							name="firstName"
							placeholder="John"
						/>
					</div>

					<div class="input-group">
						<label for="lastName">Last Name</label>
						<input
							type="text"
							id="lastName"
							bind:value={lastName}
							placeholder="Doe"
							name="lastName"
						/>
					</div>
				</div>

				<div class="input-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						bind:value={email}
						placeholder="john.doe@example.com"
					/>
				</div>

				<div class="input-group">
					<label for="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						bind:value={username}
						placeholder="Choose a username"
					/>
				</div>

				<div class="input-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						bind:value={password}
						placeholder="Create a strong password"
					/>
				</div>

				<div class="input-group">
					<label for="confirmPassword">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						bind:value={confirmPassword}
						placeholder="Re-enter your password"
					/>
				</div>

				<div class="button-container">
					<button type="submit" class="register-btn">Create Account</button>
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

	.name-section {
		display: flex;
		gap: 16px;
		margin-bottom: 16px;
	}

	.name-section .input-group {
		flex: 1;
		margin-bottom: 0;
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

	input[type='text'],
	input[type='email'],
	input[type='password'] {
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

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='password']:focus {
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

	.register-btn {
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

	.register-btn:hover {
		background-color: var(--accent-hover);
	}

	.register-btn:active {
		transform: scale(0.98);
	}

	@media (max-width: 568px) {
		.auth-card {
			padding: 24px;
		}

		.name-section {
			flex-direction: column;
			gap: 16px;
		}
	}
</style>
