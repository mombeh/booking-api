import request from 'supertest';
import app from '../../app.js';
import { providerToken } from '../setup.test.js';

let createdSlot;

describe("Provider Time Slot", () => {
  test("Create time slot successfully", async () => {
    const res = await request(app)
      .post('/api/time-slot/create')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        date: "2025-06-01",
        start_time: "09:00",
        end_time: "10:00"
      });

    expect(res.status).toBe(201);
    createdSlot = res.body.timeSlot;
  });

  test("Fail to create overlapping time slot", async () => {
    const res = await request(app)
      .post('/api/time-slot/create')
      .set('Authorization', `Bearer ${providerToken}`)
      .send({
        date: "2025-06-01",
        start_time: "09:30",
        end_time: "10:30"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already exists/i);
  });

  test("View provider time slots", async () => {
    const res = await request(app)
      .get('/api/time-slot/view')
      .set('Authorization', `Bearer ${providerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.slots.length).toBeGreaterThan(0);
  });
});
