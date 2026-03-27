import request from 'supertest';
import app from '../../app.js';

describe("Provider Authentication", () => {
  test("Register new provider", async () => {
    const res = await request(app).post('/api/providers/register').send({
      service_name: "Therapist",
      email: "therapist1@example.com",
      password: "therapypass"
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("Login with correct credentials", async () => {
    const res = await request(app).post('/api/providers/login').send({
      email: "therapist1@example.com",
      password: "therapypass"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Fail login with wrong email", async () => {
    const res = await request(app).post('/api/providers/login').send({
      email: "wrong@example.com",
      password: "therapypass"
    });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });
});
