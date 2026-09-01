// Razorpay Checkout helpers for the public book checkout.
const RZP_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const existing = document.querySelector(`script[src="${RZP_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay.')));
      return;
    }
    const script = document.createElement('script');
    script.src = RZP_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay.'));
    document.body.appendChild(script);
  });
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Payment request failed.');
  return data;
}

export const paymentService = {
  // Opens Razorpay Checkout for an already-created order and resolves once the
  // payment is verified server-side. Rejects if the user closes the modal or
  // verification fails.
  async payForOrder(orderId) {
    const rzp = await postJson('/api/payments/razorpay/order', { orderId });
    await loadRazorpayScript();

    return new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: rzp.keyId,
        order_id: rzp.razorpayOrderId,
        amount: rzp.amount,
        currency: rzp.currency,
        name: 'Ellangala’s Academy',
        description: `Order ${rzp.orderId}`,
        prefill: { name: rzp.customerName, email: rzp.email, contact: rzp.phone },
        theme: { color: '#CA8A38' },
        modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
        handler: async (response) => {
          try {
            const verified = await postJson('/api/payments/razorpay/verify', {
              orderId: rzp.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            resolve(verified.order);
          } catch (err) {
            reject(err);
          }
        }
      });
      checkout.on('payment.failed', (resp) => {
        reject(new Error(resp?.error?.description || 'Payment failed.'));
      });
      checkout.open();
    });
  }
};
