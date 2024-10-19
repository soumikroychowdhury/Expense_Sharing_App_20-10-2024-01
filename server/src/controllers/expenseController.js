const Expense = require('../models/Expense');
const User = require('../models/User');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Private
exports.addExpense = async (req, res) => {
  const { description, amount, splitMethod, participants } = req.body;

  // Validate required fields
  if (!description || !amount || !splitMethod || !participants) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Validate split method
  if (!['equal', 'exact', 'percentage'].includes(splitMethod)) {
    return res.status(400).json({ message: 'Invalid split method' });
  }

  // Validate participants
  if (!Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: 'Participants are required' });
  }

  // Additional validation based on split method
  if (splitMethod === 'percentage') {
    const totalPercentage = participants.reduce((acc, p) => acc + (p.percentage || 0), 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({ message: 'Total percentage must add up to 100%' });
    }
  }

  // Create Expense
  const expense = new Expense({
    description,
    amount,
    paidBy: req.user._id,
    splitMethod,
    participants,
  });

  try {
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get expenses for a specific user
// @route   GET /api/expenses/user/:userId
// @access  Private
exports.getUserExpenses = async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { 'participants.user': userId },
      ],
    }).populate('paidBy', 'name email');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get overall expenses
// @route   GET /api/expenses/overall
// @access  Private
exports.getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download balance sheet
// @route   GET /api/expenses/balance-sheet
// @access  Private
exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email');

    // Process data for balance sheet
    const balanceSheet = {};

    expenses.forEach(expense => {
      const payer = expense.paidBy.name;
      if (!balanceSheet[payer]) balanceSheet[payer] = 0;

      expense.participants.forEach(part => {
        const participant = part.user.name;
        if (!balanceSheet[participant]) balanceSheet[participant] = 0;

        let owedAmount = 0;
        if (expense.splitMethod === 'equal') {
          owedAmount = expense.amount / expense.participants.length;
        } else if (expense.splitMethod === 'exact') {
          owedAmount = part.amount;
        } else if (expense.splitMethod === 'percentage') {
          owedAmount = (expense.amount * part.percentage) / 100;
        }

        if (participant !== payer) {
          balanceSheet[payer] += owedAmount;
          balanceSheet[participant] -= owedAmount;
        }
      });
    });

    // Convert balanceSheet object to array for CSV
    const data = Object.keys(balanceSheet).map(user => ({
      User: user,
      Balance: balanceSheet[user].toFixed(2),
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('balance_sheet.csv');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
