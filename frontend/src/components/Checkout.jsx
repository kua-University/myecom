import { useState } from 'react';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, subtotal, fetchCart } = useCart();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const tax = subtotal * 0.05;
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + tax + shipping;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.zip) {
      toast.error('All address fields required');
      return;
    }
    setStep(2);
  };

  const placeOrder = async () => {
    try {
      const shippingAddress = `${address.street}, ${address.city} ${address.zip}`;
      const res = await API.post('/orders', { shipping_address: shippingAddress });
      setOrderId(res.data.orderId);
      fetchCart(); // clear cart locally
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    }
  };

  if (orderId) {
    return (
      <div className="checkout-success">
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: {orderId}</p>
        <p>Total: ${total.toFixed(2)}</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== 3) {
    return <p>Cart is empty</p>;
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      {step === 1 && (
        <form onSubmit={handleAddressSubmit}>
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="ZIP" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} />
          <button type="submit">Next</button>
        </form>
      )}
      {step === 2 && (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>{item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}</li>
            ))}
          </ul>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax (5%): ${tax.toFixed(2)}</p>
          <p>Shipping: {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;