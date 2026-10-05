import { getDb } from '$lib/db.js';
import { ObjectId } from 'mongodb';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { id } = params;

	try {
		const db = await getDb();
		const orders = db.collection('orders');

		const query = {
			$or: [
				{ orderId: id },
				...(ObjectId.isValid(id) ? [{ _id: new ObjectId(id) }] : [])
			]
		};

		const order = await orders.findOne(query);

		if (!order) {
			throw error(404, 'Order not found');
		}

		return {
			order: {
				...order,
				_id: order._id.toString()
			}
		};
	} catch (err) {
		if (err?.status === 404) throw err;
		console.error('Error loading order:', err);
		throw error(500, 'Could not retrieve order details');
	}
}
