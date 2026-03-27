// routes/appointments.js
import express from 'express';
import { authenticate } from '../middleware/authmiddleware.js';
import { bookAppointment } from '../controllers/appointmentController.js';
import { getAppointments, cancelAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/book', authenticate, bookAppointment);
router.get('/view', authenticate, getAppointments);
router.delete('/cancel/:id', authenticate, cancelAppointment);

export default router;
