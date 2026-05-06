import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const SalesReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await API.get('/admin/sales-report');
        setReport(res.data);
      } catch (err) {
        toast.error('Cannot load report');
      }
    };
    fetchReport();
  }, []);

  if (!report) return <div>Loading report...</div>;

  return (
    <div>
      <h2>Sales Report</h2>
      <div className="report-cards">
        <div className="card">
          <h3>Total Revenue</h3>
          <p className="big">${parseFloat(report.total_revenue).toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p className="big">{report.total_orders}</p>
        </div>
      </div>
      <h3>Top Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Total Sold</th>
          </tr>
        </thead>
        <tbody>
          {report.top_products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.total_sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;