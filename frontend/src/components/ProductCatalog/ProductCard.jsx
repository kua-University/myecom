import { Link } from 'react-router-dom';
import { getStockStatus } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onAddToCart }) => {
  const stockInfo = getStockStatus(product.stock_quantity);

  const handleAdd = (e) => {
    e.preventDefault(); // prevent link navigation
    if (product.stock_quantity <= 0) {
      toast.error('Out of stock');
      return;
    }
    onAddToCart(product.id, 1)
      .then(() => toast.success('Added to cart'))
      .catch((err) =>
        toast.error(err.response?.data?.message || 'Failed to add')
      );
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          className="product-image"
        />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <p className="stock" style={{ color: stockInfo.color }}>
            {stockInfo.text}
          </p>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAdd} disabled={product.stock_quantity <= 0}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;