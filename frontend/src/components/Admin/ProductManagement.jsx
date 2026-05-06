import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const initialState = { 
    name: '', 
    description: '', 
    price: '', 
    stock_quantity: '', 
    category_id: '', 
    image_url: '' 
  };
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products?limit=100');
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...form, 
        price: parseFloat(form.price), 
        stock_quantity: parseInt(form.stock_quantity) 
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        toast.success('Product updated');
      } else {
        await API.post('/products', payload);
        toast.success('Product created');
      }
      
      setForm(initialState);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    }
  };

  const editProduct = (prod) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      description: prod.description || '',
      price: prod.price.toString(),
      stock_quantity: prod.stock_quantity.toString(),
      category_id: prod.category_id || '',
      image_url: prod.image_url || ''
    });
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
        toast.success('Deleted');
      } catch (err) {
        toast.error('Error deleting product');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialState);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', marginBottom: '20px' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock_quantity" type="number" placeholder="Stock" value={form.stock_quantity} onChange={handleChange} required />
        <input name="category_id" type="number" placeholder="Category ID" value={form.category_id} onChange={handleChange} />
        <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleChange} />
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.stock_quantity}</td>
              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
