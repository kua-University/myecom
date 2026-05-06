import { createContext, useState, useContext, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await API.get('/cart');
      setCartItems(res.data.items);
      setSubtotal(parseFloat(res.data.subtotal));
    } catch (err) {
      console.error('Cart fetch error');
    }
  }, [user]);

  const addToCart = async (productId, quantity) => {
    const res = await API.post('/cart/items', { product_id: productId, quantity });
    setCartItems(res.data.items);
    setSubtotal(parseFloat(res.data.subtotal));
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await API.put(`/cart/items/${itemId}`, { quantity });
    setCartItems(res.data.items);
    setSubtotal(parseFloat(res.data.subtotal));
  };

  const removeItem = async (itemId) => {
    const res = await API.delete(`/cart/items/${itemId}`);
    setCartItems(res.data.items);
    setSubtotal(parseFloat(res.data.subtotal));
  };

  return (
    <CartContext.Provider value={{ cartItems, subtotal, fetchCart, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);