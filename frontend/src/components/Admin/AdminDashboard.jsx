import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
            Products
          </Link>
          <Link to="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
            Orders
          </Link>
          <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
            Users
          </Link>
          <Link to="/admin/reports" className={isActive('/admin/reports') ? 'active' : ''}>
            Reports
          </Link>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;