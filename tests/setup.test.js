import request from 'supertest';
import app from '../app.js';
import { initializeDbSchema, pool } from '../config/db.js';

export let providerToken, userToken;

beforeAll(async () => {
  await initializeDbSchema();

  // Provider auth
  await request(app).post('/api/providers/register').send({
    service_name: "Hair Stylist",
    email: "provider@test.com",
    password: "test123"
  });

  const providerLogin = await request(app).post('/api/providers/login').send({
    email: "provider@test.com",
    password: "test123"
  });
  providerToken = providerLogin.body.token;

  // User auth
  await request(app).post('/api/users/register').send({
    first_name: "Jane",
    last_name: "Doe",
    email: "user@test.com",
    password: "userpass"
  });

  const userLogin = await request(app).post('/api/users/login').send({
    email: "user@test.com",
    password: "userpass"
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await pool.end();
});
