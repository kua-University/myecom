import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { getStockStatus, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const stockInfo = getStockStatus(product.stock_quantity);

  const handleAddToCart = () => {
    if (quantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} available`);
      return;
    }
    addToCart(product.id, quantity)
      .then(() => toast.success('Added to cart'))
      .catch((err) =>
        toast.error(err.response?.data?.message || 'Failed to add')
      );
  };

  return (
    <div className="product-detail">
      <img
        src={product.image_url || '/placeholder.png'}
        alt={product.name}
        className="detail-image"
      />
      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="price">{formatCurrency(product.price)}</p>
        <p>{product.description}</p>
        <p style={{ color: stockInfo.color }}>{stockInfo.text}</p>
        <div className="quantity-selector">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stock_quantity <= 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;