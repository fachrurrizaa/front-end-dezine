// route.js
import mongooseConnect from '../../../../lib/mongoose';
import { User } from '../../../../models/User';
import { Transaction } from '../../../../models/Transaction';
import midtransClient from 'midtrans-client';

export async function POST(req) {
    await mongooseConnect();

    const { name, userId, price } = await req.json();

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        });

        let orderId = `order-${userId}-${Math.floor(1000000 + Math.random() * 9000000)}`;

        let transactionParams = {
            transaction_details: {
                order_id: orderId,
                gross_amount: price
            },
            customer_details: {
                first_name: user.name,
                email: user.email
            },
            item_details: [{
                id: 'subscription',
                price: price,
                quantity: 1,
                name: name
            }]
        };

        const transaction = await snap.createTransaction(transactionParams);

        // Save transaction history
        const newTransaction = new Transaction({
            date: new Date(),
            orderId: orderId,
            transactionType: 'Payment',
            channel: 'Bank Transfer',
            status: 'Pending', // This will be updated later based on Midtrans notification
            amount: price,
            customerEmail: user.email
        });

        await newTransaction.save();

        return new Response(JSON.stringify({ token: transaction.token }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
