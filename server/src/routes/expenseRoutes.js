const express = require('express');
const {
  addExpense,
  getUserExpenses,
  getOverallExpenses,
  downloadBalanceSheet,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Add Expense
router.post('/', addExpense);

// Retrieve individual user expenses
router.get('/user/:userId', getUserExpenses);

// Retrieve overall expenses
router.get('/overall', getOverallExpenses);

// Download balance sheet
router.get('/balance-sheet', downloadBalanceSheet);

module.exports = router;
