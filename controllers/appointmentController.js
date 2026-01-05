import { getAppointmentsByUser, findAppointmentById, deleteAppointment } from '../model/appointmentModel.js';
import { withTransaction } from "../config/db.js";
import { query } from "../config/db.js";
import { unbookTimeSlot } from "../model/timeSlotModel.js";

export const bookAppointment = async (req, res) => {
  try {
    let {provider_id, time_slot_id, appointment_time, notes } = req.body;

    // ✅ Sanitize UUIDs: remove all whitespace
    provider_id = provider_id?.replace(/\s+/g, '').trim();
    time_slot_id = time_slot_id?.replace(/\s+/g, '').trim();

    if (!provider_id || !time_slot_id || !appointment_time) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: user ID not found." });
    }

    const result = await withTransaction(async (client) => {
      // Check if the time slot exists and is available
      const { rows } = await client.query(
        `SELECT * FROM time_slots WHERE id = $1 AND provider_id = $2 AND is_booked = false`,
        [time_slot_id, provider_id]
      );

      if (rows.length === 0) {
        throw new Error("Time slot is already booked or invalid");
      }

      // Mark slot as booked
      await client.query(
        `UPDATE time_slots SET is_booked = true WHERE id = $1`,
        [time_slot_id]
      );

      // Create appointment
      const insertResult = await client.query(
        `INSERT INTO appointments (user_id, provider_id, appointment_time, notes, time_slot_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [user_id, provider_id, appointment_time, notes || null, time_slot_id]
      );

      return insertResult.rows[0];
    });

    // ✅ Respond with created appointment
    return res.status(201).json({ appointment: result });

  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(400).json({ error: error.message || "Something went wrong" });
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
        await unbookTimeSlot(appointment.time_slot_id);

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling appointment:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


