import { getAppointmentsByUser, findAppointmentById, deleteAppointment } from '../model/appointmentModel.js';
import { pool } from '../config/db.js';
import { withTransaction } from '../config/db.js';

export const bookAppointment = async (req, res) => {
    const userId = req.user.id;
    const { timeSlotId } = req.body;
    const io = req.app.get('io');

    try {
        const result = await withTransaction(async (client) => {
            // Find time slot and check availability
            const { rows: timeSlot } = await client.query('SELECT * FROM time_slots WHERE id = $1 FOR UPDATE', [timeSlotId]);
            if (timeSlot.length === 0 || timeSlot[0].is_booked) {
                throw new Error('Time slot is already booked or invalid');
            }

            const providerId = timeSlot[0].provider_id;
            const appointmentTime = new Date(`${timeSlot[0].date}T${timeSlot[0].start_time}`);

            if (isNaN(appointmentTime.getTime())) {
                throw new Error('Invalid appointment time');
            }

            // Create the appointment
            const { rows: appointment } = await client.query(`
                INSERT INTO appointments (user_id, provider_id, time_slot_id, appointment_time, status)
                VALUES ($1, $2, $3, $4, 'confirmed') RETURNING *`, 
                [userId, providerId, timeSlotId, appointmentTime]
            );

            // Update the time slot to mark it as booked
            await client.query('UPDATE time_slots SET is_booked = TRUE WHERE id = $1', [timeSlotId]);

            return appointment; // Return the newly created appointment for response
        });

        // If everything goes well, emit the appointment to the provider
        const appointment = result[0];
        io.to(`provider_${appointment.provider_id}`).emit('appointmentBooked', appointment);

        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        logger.error('Error while booking appointment', error);
        res.status(500).json({ message: error.message || 'Server error' });
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



