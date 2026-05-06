// Utility functions used across components
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

export const getStockStatus = (quantity) => {
  if (quantity > 10) return { text: 'In Stock', color: 'green' };
  if (quantity > 0) return { text: `Only ${quantity} left`, color: 'orange' };
  return { text: 'Out of Stock', color: 'red' };
};