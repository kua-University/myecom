import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, subtotal, fetchCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    updateQuantity(itemId, newQty);
  };

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/">Start shopping</Link></p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url || '/placeholder.png'} alt={item.name} width="50" />
              <div>
                <h4>{item.name}</h4>
                <p>${item.price}</p>
                <div className="quantity">
                  <button onClick={() => handleQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
          <Link to="/checkout"><button className="checkout-btn">Proceed to Checkout</button></Link>
        </>
      )}
    </div>
  );
};

export default Cart;