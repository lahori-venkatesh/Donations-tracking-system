const Razorpay = require('razorpay');
const crypto = require('crypto');
const logger = require('./logger');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
const createOrder = async (amount, currency = 'INR') => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    logger.info(`Razorpay order created: ${order.id}`);
    
    return order;
  } catch (error) {
    logger.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify payment signature
const verifyPayment = (orderId, paymentId, signature) => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === signature;
    
    if (isValid) {
      logger.info(`Payment verified successfully: ${paymentId}`);
    } else {
      logger.warn(`Payment verification failed: ${paymentId}`);
    }
    
    return isValid;
  } catch (error) {
    logger.error('Payment verification error:', error);
    return false;
  }
};

// Fetch payment details
const getPayment = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    logger.error('Fetch payment error:', error);
    throw new Error('Failed to fetch payment details');
  }
};

// Create refund
const createRefund = async (paymentId, amount, notes = {}) => {
  try {
    const refundOptions = {
      amount: amount * 100, // Amount in paise
      notes: notes
    };

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    logger.info(`Refund created: ${refund.id} for payment: ${paymentId}`);
    
    return refund;
  } catch (error) {
    logger.error('Refund creation error:', error);
    throw new Error('Failed to create refund');
  }
};

// Get refund details
const getRefund = async (paymentId, refundId) => {
  try {
    const refund = await razorpay.payments.fetchRefund(paymentId, refundId);
    return refund;
  } catch (error) {
    logger.error('Fetch refund error:', error);
    throw new Error('Failed to fetch refund details');
  }
};

// Webhook signature verification
const verifyWebhookSignature = (body, signature, secret) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    logger.error('Webhook signature verification error:', error);
    return false;
  }
};

// Handle webhook events
const handleWebhook = async (event) => {
  try {
    const { entity, event: eventType } = event;
    
    logger.info(`Razorpay webhook received: ${eventType}`);
    
    switch (eventType) {
      case 'payment.captured':
        // Handle successful payment
        logger.info(`Payment captured: ${entity.id}`);
        break;
        
      case 'payment.failed':
        // Handle failed payment
        logger.warn(`Payment failed: ${entity.id}`);
        break;
        
      case 'refund.processed':
        // Handle refund processed
        logger.info(`Refund processed: ${entity.id}`);
        break;
        
      default:
        logger.info(`Unhandled webhook event: ${eventType}`);
    }
    
    return { success: true };
  } catch (error) {
    logger.error('Webhook handling error:', error);
    throw error;
  }
};

// Generate payment link
const createPaymentLink = async (options) => {
  try {
    const {
      amount,
      currency = 'INR',
      description,
      customer,
      notify = { sms: true, email: true },
      reminder_enable = true,
      callback_url,
      callback_method = 'get'
    } = options;

    const paymentLinkOptions = {
      amount: amount * 100,
      currency,
      description,
      customer,
      notify,
      reminder_enable,
      callback_url,
      callback_method
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkOptions);
    logger.info(`Payment link created: ${paymentLink.id}`);
    
    return paymentLink;
  } catch (error) {
    logger.error('Payment link creation error:', error);
    throw new Error('Failed to create payment link');
  }
};

module.exports = {
  razorpay,
  createOrder,
  verifyPayment,
  getPayment,
  createRefund,
  getRefund,
  verifyWebhookSignature,
  handleWebhook,
  createPaymentLink
};