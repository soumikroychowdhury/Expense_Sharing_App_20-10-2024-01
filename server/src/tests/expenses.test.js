const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import the Express app
const User = require('../models/User');
const Expense = require('../models/Expense');
require('dotenv').config({ path: '.env.test' });

let token;
let userId;

beforeAll(async () => {
  const url = process.env.MONGODB_URI_TEST;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a user and get the token for expense testing
  const res = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Expense User',
      email: 'expense@example.com',
      mobileNumber: '1234567890',
      password: 'password123',
    });

  token = res.body.token;
  userId = res.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Expense API tests', () => {
  let expenseId;

  // Add Expense
  it('should add a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Lunch',
        amount: 100,
        splitMethod: 'equal',
        participants: [
          { user: userId },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('description', 'Lunch');
    expenseId = res.body._id;
  });

  // Invalid Split Method
  it('should fail to add an expense with invalid split method', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Dinner',
        amount: 200,
        splitMethod: 'invalid-method', // Invalid
        participants: [
          { user: userId },
        ],
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid split method');
  });

  // Get User Expenses
  it('should get expenses for a user', async () => {
    const res = await request(app)
      .get(`/api/expenses/user/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Get Overall Expenses
  it('should get overall expenses', async () => {
    const res = await request(app)
      .get('/api/expenses/overall')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
