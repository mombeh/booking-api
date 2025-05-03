import { createAppointment } from '../model/appointmentModel.js';
import { findTimeSlotById } from '../model/timeSlotModel.js';
import { getAppointmentsByUser } from '../model/appointmentModel.js';
export const bookAppointment = async (req, res) => {
    const userId = req.user.id;
    const { timeSlotId } = req.body;
    const io = req.app.get('io'); // ← get the Socket.IO server instance

    try {
        const timeSlot = await findTimeSlotById(timeSlotId);
        if (!timeSlot) {
            return res.status(404).json({ message: 'Time slot not found' });
        }

        const providerId = timeSlot.provider_id;

        const dateStr = timeSlot.date instanceof Date
            ? timeSlot.date.toISOString().split('T')[0]
            : timeSlot.date;

        const timeStr = typeof timeSlot.start_time === 'string'
            ? timeSlot.start_time
            : timeSlot.start_time.toTimeString().split(' ')[0];

        console.log('Combined datetime string:', `${dateStr}T${timeStr}`);

        const appointmentTime = new Date(`${dateStr}T${timeStr}`);

        console.log('Parsed appointmentTime:', appointmentTime.toISOString());


        if (isNaN(appointmentTime.getTime())) {
            return res.status(400).json({ message: 'Invalid appointment time', debug: { dateStr, timeStr } });
        }

        const appointment = await createAppointment(userId, providerId, timeSlotId, appointmentTime);

        // After successful booking
        io.emit('appointment:booked', {
            user_id: userId,
            provider_id: providerId,
            time: appointmentTime,
        });
        res.status(201).json({ message: 'Appointment booked', appointment });


    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAppointments = async (req, res) => {
    const userId = req.query.user_id;

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

