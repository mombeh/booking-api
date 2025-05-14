import { getAppointmentsByUser, findAppointmentById, deleteAppointment } from '../model/appointmentModel.js';
import { query } from '../config/db.js';
import { withTransaction } from '../config/db.js';

// POST /api/appointments/book
export const bookAppointment = async (req, res) => {
  const { user_id, provider_id, appointment_time, time_slot_id, notes } = req.body;

  try {
    const result = await withTransaction(async (client) => {
      // 1. Check if the time slot exists and is not booked
      const slotResult = await client.query(
        `SELECT * FROM time_slots WHERE id = $1 AND provider_id = $2 AND is_booked = FALSE`,
        [time_slot_id, provider_id]
      );

      if (slotResult.rows.length === 0) {
        throw new Error("Time slot is already booked or invalid");
      }

      // 2. Insert appointment
      const appointmentResult = await client.query(
        `INSERT INTO appointments (user_id, provider_id, appointment_time, time_slot_id, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, provider_id, appointment_time, time_slot_id, notes]
      );

      const newAppointment = appointmentResult.rows[0];

      // 3. Mark the slot as booked
      await client.query(
        `UPDATE time_slots SET is_booked = TRUE WHERE id = $1`,
        [time_slot_id]
      );

      // 4. Get full appointment details (joined with user and provider info)
      const detailedResult = await client.query(`
        SELECT *
        FROM appointments a
        JOIN users u ON u.id = a.user_id
        JOIN service_providers sp ON sp.id = a.provider_id
        JOIN time_slots ts ON ts.id = a.time_slot_id
        WHERE a.id = $1
      `, [newAppointment.id]);

      return detailedResult.rows[0]; // the full joined data
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: result,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getAppointments = async (req, res) => {
    const userId = req.user.id;

    try {
        const appointments = await getAppointmentsByUser(userId); // Call the model function
        if (appointments.length === 0) {
            return res.status(404).json({ message: 'No appointments found for this user' });
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;

    try {
        const appointment = await findAppointmentById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.user_id !== userId) {
            return res.status(403).json({ message: 'You are not authorized to cancel this appointment' });
        }

        await deleteAppointment(appointmentId);
        await updateTimeSlot(appointment.time_slot_id, { is_booked: false }); // unbook the slot

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling appointment:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



