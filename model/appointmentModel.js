import { query } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createAppointment = async (userId, providerId, timeSlotId, appointmentTime) => {
  const id = uuidv4();
  const status = 'confirmed';
  const createdAt = new Date();

  const result = await query(`
    INSERT INTO appointments (id, user_id, provider_id, time_slot_id, appointment_time, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [id, userId, providerId, timeSlotId, appointmentTime, status, createdAt]
  );

  return result.rows[0];
};

export const getAppointmentsByUser = async (userId) => {
    try {
        const result = await query(
            'SELECT * FROM appointments WHERE user_id = $1',
            [userId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error fetching appointments in model:', error);
        throw error; // rethrow error to be handled by controller
    }
};
