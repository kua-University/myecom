import { useState, useEffect } from 'react';
import API from "../../api/axios";
import ProductCard from './ProductCard';
import { useCart } from "../../context/CartContext";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await API.get('/categories');
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      try {
        const res = await API.get('/products', { params });
        setProducts(res.data);
        // For simplicity, assume total count from header or just set current page
        // In a real app, backend would return total count. We'll just assume next page if 9 items.
        setTotalPages(res.data.length === 9 ? page + 1 : page);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [search, category, minPrice, maxPrice, page]);

  return (
    <div className="product-list-container">
      <div className="filters">
        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        <input type="number" placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      </div>
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
      </div>
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {page}</span>
        <button disabled={products.length < 9} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ProductList;