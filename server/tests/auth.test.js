const request = require('supertest');
const { syncDatabase } = require('../models');
const app = require('../index');

describe('Authentication API', () => {
  beforeAll(async () => {
    await syncDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User For Registration',
        email: 'test@example.com',
        password: 'TestPass123!',
        address: '123 Test Street, Test City, Test State 12345'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe('normal_user');
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'Test User For Registration',
        email: 'invalid-email',
        password: 'TestPass123!',
        address: '123 Test Street, Test City, Test State 12345'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with short name', async () => {
      const userData = {
        name: 'Ab',
        email: 'test2@example.com',
        password: 'TestPass123!',
        address: '123 Test Street, Test City, Test State 12345'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should register with valid short name (5 characters)', async () => {
      const userData = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'TestPass123!',
        address: '123 Test Street, Test City, Test State 12345'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body.user.name).toBe('Alice');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'admin@roxiler.com',
        password: 'Admin@123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should fail with invalid credentials', async () => {
      const loginData = {
        email: 'admin@roxiler.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });
});
