// backend/controllers/paymentController.js
const crypto = require('crypto');
const Order = require('../models/Order');

// @desc    Generate PayHere payment hash
// @route   POST /api/payment/generate-hash
// @access  Private
exports.generatePayHereHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;
        
        const merchant_id = process.env.PAYHERE_MERCHANT_ID || '1231991';
        // Your PayHere merchant secret - GET THIS FROM PAYHERE DASHBOARD
        const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || 'TEST_SECRET_FOR_SANDBOX';
        
        // Validate required fields
        if (!merchant_id || !order_id || !amount || !currency) {
            return res.status(400).json({ 
                message: 'Missing required fields for hash generation' 
            });
        }

        // Create hash string as per PayHere documentation
        const hash_string = merchant_id + order_id + amount + currency + 
                           crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        
        const hash = crypto.createHash('md5').update(hash_string).digest('hex').toUpperCase();
        
        console.log('Generated hash for order:', order_id);
        
        res.json({ 
            hash,
            merchant_id,
            order_id,
            amount,
            currency 
        });
        
    } catch (error) {
        console.error('Hash generation error:', error);
        res.status(500).json({ 
            message: 'Failed to generate payment hash',
            error: error.message 
        });
    }
};

// @desc    Handle PayHere payment notifications
// @route   POST /api/payment/notify
// @access  Public (PayHere webhook)
exports.handlePayHereNotification = async (req, res) => {
    try {
        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            custom_1,
            custom_2,
            method,
            status_message,
            card_holder_name,
            card_no,
            card_expiry
        } = req.body;

        console.log('PayHere notification received:', {
            order_id,
            payment_id,
            status_code,
            status_message,
            payhere_amount
        });

        // Verify the notification (recommended for production)
        const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || 'TEST_SECRET_FOR_SANDBOX';
        const local_md5sig = crypto.createHash('md5')
            .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase())
            .digest('hex')
            .toUpperCase();

        // For sandbox testing, we might skip signature verification
        const isSignatureValid = process.env.NODE_ENV === 'development' || md5sig === local_md5sig;

        if (!isSignatureValid) {
            console.error('Invalid PayHere signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Find the order in database
        const order = await Order.findOne({ orderId: order_id });
        if (!order) {
            console.error('Order not found:', order_id);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order based on payment status
        let orderStatus;
        let paymentStatus;

        switch(status_code) {
            case '2': // Success
                orderStatus = 'paid';
                paymentStatus = 'completed';
                break;
            case '0': // Pending
                orderStatus = 'pending';
                paymentStatus = 'pending';
                break;
            case '-1': // Canceled
                orderStatus = 'cancelled';
                paymentStatus = 'cancelled';
                break;
            case '-2': // Failed
                orderStatus = 'failed';
                paymentStatus = 'failed';
                break;
            case '-3': // Chargedback
                orderStatus = 'refunded';
                paymentStatus = 'chargedback';
                break;
            default:
                orderStatus = 'failed';
                paymentStatus = 'unknown';
        }

        // Update the order
        order.status = orderStatus;
        order.paymentStatus = paymentStatus;
        order.paymentId = payment_id;
        order.paymentMethod = method;
        order.paymentDetails = {
            payhere_amount,
            payhere_currency,
            status_code,
            status_message,
            card_holder_name: card_holder_name || null,
            card_no: card_no || null,
            card_expiry: card_expiry || null,
            notificationReceivedAt: new Date()
        };

        if (orderStatus === 'paid') {
            order.paidAt = new Date();
        }

        await order.save();

        console.log(`Order ${order_id} updated to status: ${orderStatus}`);

        // Send success response to PayHere
        res.status(200).send('OK');

    } catch (error) {
        console.error('PayHere notification handling error:', error);
        res.status(500).json({ 
            message: 'Failed to process payment notification',
            error: error.message 
        });
    }
};

// @desc    Verify payment status
// @route   GET /api/payment/verify/:orderId
// @access  Private
exports.verifyPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findOne({ orderId: orderId, user: req.user.id });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            orderId: order.orderId,
            status: order.status,
            paymentStatus: order.paymentStatus,
            paymentId: order.paymentId,
            total: order.total,
            paidAt: order.paidAt
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            message: 'Failed to verify payment status',
            error: error.message 
        });
    }
};