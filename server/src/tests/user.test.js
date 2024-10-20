const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import the Express app
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

beforeAll(async () => {
  const url = process.env.MONGODB_URI_TEST;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API tests', () => {
  let token;
  let userId;

  // Register User
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        mobileNumber: '1234567890',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
    userId = res.body._id;
  });

  // Duplicate Email Check
  it('should not register user with duplicate email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Jane Doe',
        email: 'john@example.com', // Same email as before
        mobileNumber: '0987654321',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });

  // Login User
  it('should login the registered user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'john@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  // Get User Details
  it('should get user details when authenticated', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'John Doe');
  });

  // Access User Without Token
  it('should fail to access user details without token', async () => {
    const res = await request(app).get(`/api/users/${userId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });

  // Get All Users
  it('should fetch all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
