import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products?limit=100');
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch products error:', err);
      toast.error('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
      image_url: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (form.stock_quantity === '' || parseInt(form.stock_quantity) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock_quantity: parseInt(form.stock_quantity),
      category_id: form.category_id ? parseInt(form.category_id) : null,
      image_url: form.image_url.trim() || null
    };

    console.log('Submitting product:', payload);
    console.log('Token:', localStorage.getItem('token')?.substring(0, 20) + '...');

    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
        toast.success('Product updated successfully');
      } else {
        const response = await API.post('/products', payload);
        console.log('Create response:', response.data);
        toast.success(`Product created! ID: ${response.data.id}`);
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Error:', err.response || err);
      const message = err.response?.data?.message || 'Failed to save product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (prod) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name || '',
      description: prod.description || '',
      price: prod.price?.toString() || '',
      stock_quantity: prod.stock_quantity?.toString() || '',
      category_id: prod.category_id?.toString() || '',
      image_url: prod.image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <h2>Product Management</h2>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        border: '1px solid #dee2e6'
      }}>
        <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Product Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Price ($) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Stock Quantity *</label>
              <input
                name="stock_quantity"
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={handleChange}
                placeholder="0"
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 2, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Image URL</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                padding: '0.6rem 1.5rem', 
                background: loading ? '#95a5a6' : '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  padding: '0.6rem 1.5rem', 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer'
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <h3>Product List ({products.length})</h3>
      
      {products.length === 0 ? (
        <p>No products yet. Use the form above to add one.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f2f2f2' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={tdStyle}>{p.id}</td>
                  <td style={tdStyle}>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>${parseFloat(p.price).toFixed(2)}</td>
                  <td style={tdStyle}>{p.stock_quantity}</td>
                  <td style={tdStyle}>{p.category_id || '—'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => editProduct(p)} style={btnStyle}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)} style={{ ...btnStyle, background: '#e74c3c' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = { padding: '0.6rem', border: '1px solid #ddd', textAlign: 'left' };
const tdStyle = { padding: '0.5rem', border: '1px solid #ddd' };
const btnStyle = { 
  padding: '0.3rem 0.7rem', 
  marginRight: '0.3rem', 
  background: '#3498db', 
  color: 'white', 
  border: 'none', 
  borderRadius: '3px', 
  cursor: 'pointer' 
};

export default ProductManagement;
