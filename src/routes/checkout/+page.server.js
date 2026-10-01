import { getDb } from '$lib/db.js';
import { ObjectId } from 'mongodb';

export const actions = {
	placeOrder: async ({ request }) => {
		const formData = await request.formData();
		const orderData = JSON.parse(formData.get('orderData'));

		const db = await getDb();
		const orders = db.collection('orders');

		const result = await orders.insertOne({
			...orderData,
			createdAt: new Date()
		});

		// Save shipping address and contact info to user account
		if (orderData.userId) {
			try {
				const addresses = db.collection('addresses');
				const users = db.collection('users');

				if (orderData.shipping?.street && orderData.shipping?.city) {
					const existingAddr = await addresses.findOne({
						userId: orderData.userId,
						street: orderData.shipping.street,
						city: orderData.shipping.city
					});

					if (!existingAddr) {
						const count = await addresses.countDocuments({ userId: orderData.userId });
						await addresses.insertOne({
							label: 'Shipping',
							street: orderData.shipping.street,
							city: orderData.shipping.city,
							state: orderData.shipping.state || '',
							zip: orderData.shipping.zip || '',
							country: orderData.shipping.country || 'USA',
							userId: orderData.userId,
							isDefault: count === 0,
							createdAt: new Date()
						});
					}
				}

				const updates = {};
				if (orderData.shipping?.phone) {
					updates.phone = orderData.shipping.phone;
				}
				if (orderData.shipping?.fullName) {
					updates.name = orderData.shipping.fullName;
				}

				if (Object.keys(updates).length > 0 && ObjectId.isValid(orderData.userId)) {
					await users.updateOne(
						{ _id: new ObjectId(orderData.userId) },
						{ $set: updates }
					);
				}
			} catch (err) {
				console.error('Error saving order details to account:', err);
			}
		}

		return {
			success: true,
			orderId: result.insertedId.toString()
		};
	}
};
