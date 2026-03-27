import request from 'supertest';
import app from '../../app.js';
import { userToken, providerToken } from '../setup.test.js';

let slotId, providerId;

beforeAll(async () => {
  // Create a time slot for booking
  const res = await request(app)
    .post('/api/time-slot/create')
    .set('Authorization', `Bearer ${providerToken}`)
    .send({
      date: "2025-06-02",
      start_time: "11:00",
      end_time: "12:00"
    });

  slotId = res.body.timeSlot.id;
  providerId = res.body.timeSlot.provider_id;
});

describe("User Appointments", () => {
  test("Book appointment successfully", async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        provider_id: providerId,
        time_slot_id: slotId,
        appointment_time: "2025-06-02T11:00:00Z"
      });

    expect(res.status).toBe(201);
    expect(res.body.appointment).toHaveProperty("id");
  });

  test("Fail to double-book same slot", async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        provider_id: providerId,
        time_slot_id: slotId,
        appointment_time: "2025-06-02T11:00:00Z"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already booked/i);
  });

  test("Fail booking with no token", async () => {
    const res = await request(app)
      .post('/api/appointments/book')
      .send({
        provider_id: providerId,
        time_slot_id: slotId,
        appointment_time: "2025-06-02T11:00:00Z"
      });

    expect(res.status).toBe(401);
  });

  test("View user appointments", async () => {
    const res = await request(app)
      .get('/api/appointments/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.appointments.length).toBeGreaterThan(0);
  });
});
