import { getDb } from '$lib/db.js';
import { ObjectId } from 'mongodb';
import { fail } from '@sveltejs/kit';

// Load user addresses and orders
export async function load({ url, cookies }) {
	const userId = cookies.get('userId');
	if (!userId) return { addresses: [], orders: [] };

	const db = await getDb();
	const addresses = db.collection('addresses');
	const orders = db.collection('orders');
	const cards = db.collection('cards');

	const userAddresses = await addresses.find({ userId }).toArray();
	const userCards = await cards.find({ userId }).toArray();
	const userOrders = await orders.find({ userId }).sort({ createdAt: -1 }).toArray();

	return {
		addresses: userAddresses.map((addr) => ({
			...addr,
			_id: addr._id.toString()
		})),
		cards: userCards.map((card) => ({
			...card,
			_id: card._id.toString()
		})),
		orders: userOrders.map((order) => ({
			...order,
			_id: order._id.toString()
		}))
	};
}

export const actions = {
	addAddress: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const address = JSON.parse(formData.get('address'));

		const db = await getDb();
		const addresses = db.collection('addresses');

		// Check if first address
		const count = await addresses.countDocuments({ userId });

		const result = await addresses.insertOne({
			...address,
			userId,
			isDefault: count === 0,
			createdAt: new Date()
		});

		return { success: true, addressId: result.insertedId.toString() };
	},

	updateAddress: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');
		const updates = JSON.parse(formData.get('updates'));

		const db = await getDb();
		const addresses = db.collection('addresses');

		await addresses.updateOne({ _id: new ObjectId(addressId) }, { $set: updates });

		return { success: true };
	},

	deleteAddress: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');

		const db = await getDb();
		const addresses = db.collection('addresses');

		await addresses.deleteOne({ _id: new ObjectId(addressId) });

		return { success: true };
	},

	setDefault: async ({ request }) => {
		const formData = await request.formData();
		const addressId = formData.get('addressId');
		const userId = formData.get('userId');

		const db = await getDb();
		const addresses = db.collection('addresses');

		// Remove default from all
		await addresses.updateMany({ userId }, { $set: { isDefault: false } });

		// Set new default
		await addresses.updateOne({ _id: new ObjectId(addressId) }, { $set: { isDefault: true } });

		return { success: true };
	},

	addCard: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const card = JSON.parse(formData.get('card'));

		const db = await getDb();
		const cards = db.collection('cards');

		// Check if first card
		const count = await cards.countDocuments({ userId });

		const result = await cards.insertOne({
			...card,
			userId,
			isDefault: count === 0,
			createdAt: new Date()
		});

		return { success: true, cardId: result.insertedId.toString() };
	},

	updateCard: async ({ request }) => {
		const formData = await request.formData();
		const cardId = formData.get('cardId');
		const updates = JSON.parse(formData.get('updates'));

		const db = await getDb();
		const cards = db.collection('cards');

		await cards.updateOne({ _id: new ObjectId(cardId) }, { $set: updates });

		return { success: true };
	},

	deleteCard: async ({ request }) => {
		const formData = await request.formData();
		const cardId = formData.get('cardId');

		const db = await getDb();
		const cards = db.collection('cards');

		await cards.deleteOne({ _id: new ObjectId(cardId) });

		return { success: true };
	},

	setDefaultCard: async ({ request }) => {
		const formData = await request.formData();
		const cardId = formData.get('cardId');
		const userId = formData.get('userId');

		const db = await getDb();
		const cards = db.collection('cards');

		// Remove default from all
		await cards.updateMany({ userId }, { $set: { isDefault: false } });

		// Set new default
		await cards.updateOne({ _id: new ObjectId(cardId) }, { $set: { isDefault: true } });

		return { success: true };
	},

	updateProfile: async ({ request }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const name = formData.get('name');
		const email = formData.get('email');
		const phone = formData.get('phone');

		const db = await getDb();
		const users = db.collection('users');

		await users.updateOne({ _id: new ObjectId(userId) }, { $set: { name, email, phone } });

		return {
			success: true,
			user: { _id: userId, name, email, phone }
		};
	}
};
