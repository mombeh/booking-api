import request from 'supertest';
import app from '../../app.js';

describe("User Authentication", () => {
  test("Register new user", async () => {
    const res = await request(app).post('/api/users/register').send({
      first_name: "Test",
      last_name: "User",
      email: "testuser1@example.com",
      password: "password123"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("Fail to register with existing email", async () => {
    const res = await request(app).post('/api/users/register').send({
      first_name: "Test",
      last_name: "User",
      email: "testuser1@example.com", // already registered
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test("Login with correct credentials", async () => {
    const res = await request(app).post('/api/users/login').send({
      email: "testuser1@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Fail login with wrong password", async () => {
    const res = await request(app).post('/api/users/login').send({
      email: "testuser1@example.com",
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });
});
