// src/components/Admin/OrderManagement.jsx
import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders (admin only)
  const fetchOrders = async () => {
    try {
      // Uses a dedicated admin route: GET /api/orders/all
      const res = await API.get('/orders/all');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      // Update local state optimistically
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order #${orderId} marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
      console.error(err);
    }
  };

  // Get human-friendly status badge style
  const getStatusBadge = (status) => {
    const styles = {
      pending: { background: '#f1c40f', color: '#000' },
      shipped: { background: '#3498db', color: '#fff' },
      delivered: { background: '#2ecc71', color: '#fff' },
      cancelled: { background: '#e74c3c', color: '#fff' },
    };
    return (
      <span
        style={{
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.85rem',
          ...styles[status] || { background: '#ddd', color: '#333' },
        }}
      >
        {status}
      </span>
    );
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h2>Order Management</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user_id}</td>
                  <td>{formatCurrency(order.total_amount)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={order.status === 'delivered' || order.status === 'cancelled'}
                      style={{
                        padding: '0.3rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

export default OrderManagement;