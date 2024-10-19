import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/expenses/overall', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (error) {
      alert('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/add-expense">Add Expense</Link> | <Link to="/balance-sheet">Download Balance Sheet</Link>
      <h3>All Expenses</h3>
      <ul>
        {expenses.map(expense => (
          <li key={expense._id}>
            <strong>{expense.description}</strong> - ₹{expense.amount} by {expense.paidBy.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
