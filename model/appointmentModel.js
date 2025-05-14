import { query } from '../config/db.js';
// import { v4 as uuidv4 } from 'uuid';

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

// Find an appointment by its ID
export const findAppointmentById = async (appointmentId) => {
  const result = await db.query('SELECT * FROM appointments WHERE id = $1', [appointmentId]);
  return result.rows[0]; // return the first match or undefined
};

// Delete an appointment by its ID
export const deleteAppointment = async (appointmentId) => {
  const result = await db.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);
  return result.rowCount > 0; // returns true if a row was deleted
};
