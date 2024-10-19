import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import BalanceSheet from './pages/BalanceSheet';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/add-expense" 
          element={
            <PrivateRoute>
              <AddExpense />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/balance-sheet" 
          element={
            <PrivateRoute>
              <BalanceSheet />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
