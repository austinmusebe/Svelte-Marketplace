import headphones from '$lib/assets/headphones.jpg';
import watch from '$lib/assets/watch.jpg';
import keyboard from '$lib/assets/keyboard.jpg';
import cable from '$lib/assets/cable.jpg';
import noiseCancellingPods from '$lib/assets/noise_cancelling_pods.jpg';
import studioMonitors from '$lib/assets/studio_monitors.jpg';
import hybridSmartwatch from '$lib/assets/hybrid_smartwatch.jpg';
import ruggedSmartwatch from '$lib/assets/rugged_smartwatch.jpg';
import splitKeyboard from '$lib/assets/split_keyboard.jpg';
import magneticCable from '$lib/assets/magnetic_cable.jpg';

export const products = [
	{
		id: '1',
		name: 'Premium Headphones',
		price: 99.99,
		image: headphones,
		category: 'Audio',
		description: 'High-quality audio with active noise cancellation and ergonomic ear cushions.',
		stock: 12,
		variants: ['Matte Black', 'Silver', 'Navy Blue']
	},
	{
		id: '2',
		name: 'Smart Watch',
		price: 199.99,
		image: watch,
		category: 'Wearables',
		description: 'Track your fitness, heart rate, and daily activity with an OLED touchscreen.',
		stock: 8,
		variants: ['Space Gray', 'Rose Gold', 'Midnight']
	},
	{
		id: '3',
		name: 'Wireless Keyboard',
		price: 79.99,
		image: keyboard,
		category: 'Accessories',
		description: 'Tactile mechanical switches with wireless Bluetooth connectivity and RGB backlighting.',
		stock: 15,
		variants: ['Linear Red', 'Clicky Blue', 'Tactile Brown']
	},
	{
		id: '4',
		name: 'USB-C Cable',
		price: 19.99,
		image: cable,
		category: 'Accessories',
		description: 'Braided fast-charging nylon cable supporting up to 100W Power Delivery.',
		stock: 45,
		variants: ['1 Meter', '2 Meters', '3 Meters']
	},
	{
		id: '5',
		name: 'Studio Wireless Earbuds',
		price: 129.99,
		image: headphones,
		category: 'Audio',
		description: 'True wireless stereo earbuds with spatial audio and sweat-resistant design.',
		stock: 20,
		variants: ['White', 'Black']
	},
	{
		id: '6',
		name: 'Fitness Band Pro',
		price: 59.99,
		image: watch,
		category: 'Wearables',
		description: 'Lightweight water-resistant activity tracker with 14-day battery life.',
		stock: 5,
		variants: ['Black', 'Navy', 'Olive']
	},
	{
		id: '7',
		name: 'Mechanical Gaming Keyboard',
		price: 119.99,
		image: keyboard,
		category: 'Accessories',
		description: 'Tenkeyless compact gaming keyboard with hot-swappable switches and PBT keycaps.',
		stock: 10,
		variants: ['RGB Black', 'Retro White']
	},
	{
		id: '8',
		name: 'Fast Multi-Charging Cable',
		price: 24.99,
		image: cable,
		category: 'Accessories',
		description: '3-in-1 multi charger with USB-C, Lightning, and Micro USB connectors.',
		stock: 30,
		variants: ['Red Braided', 'Black Braided']
	},
	{
		id: '9',
		name: 'Noise-Cancelling Pods',
		price: 149.99,
		image: noiseCancellingPods,
		category: 'Audio',
		description: 'Ultra-compact wireless pods featuring smart touch controls, adaptive EQ, and 24-hour battery case.',
		stock: 18,
		variants: ['Matte White', 'Charcoal', 'Lilac']
	},
	{
		id: '10',
		name: 'Over-Ear Studio Monitors',
		price: 249.99,
		image: studioMonitors,
		category: 'Audio',
		description: 'Professional-grade flat response headphones for mixing, mastering, and critical listening.',
		stock: 7,
		variants: ['Studio Black']
	},
	{
		id: '11',
		name: 'Hybrid Chronograph Smartwatch',
		price: 179.99,
		image: hybridSmartwatch,
		category: 'Wearables',
		description: 'Blends classic analog hands with a hidden OLED display for modern notification syncing.',
		stock: 11,
		variants: ['Stainless Steel', 'Leather Brown']
	},
	{
		id: '12',
		name: 'Rugged Outdoor GPS Watch',
		price: 299.99,
		image: ruggedSmartwatch,
		category: 'Wearables',
		description: 'Military-grade durability with built-in topographic maps, altimeter, and a 30-day battery life.',
		stock: 4,
		variants: ['Camo Green', 'Stealth Black']
	},
	{
		id: '13',
		name: 'Ergonomic Split Keyboard',
		price: 139.99,
		image: splitKeyboard,
		category: 'Accessories',
		description: 'A split ergonomic mechanical keyboard designed to reduce wrist strain and maximize typing efficiency.',
		stock: 9,
		variants: ['Tactile Brown', 'Silent Red']
	},
	{
		id: '14',
		name: 'Magnetic Charging Cable',
		price: 14.99,
		image: magneticCable,
		category: 'Accessories',
		description: 'Breakaway magnetic charging cable that protects your device port and connects instantly.',
		stock: 60,
		variants: ['1.5 Meters', '2 Meters']
	}
];

export function getProductById(id) {
	return products.find((p) => p.id === String(id)) || null;
}

export function getCategories() {
	return ['All', ...new Set(products.map((p) => p.category))];
}
