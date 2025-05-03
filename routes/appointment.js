// routes/appointments.js
import express from 'express';
import { authenticate } from '../middleware/authmiddleware.js';
import { bookAppointment } from '../controllers/appointmentController.js';
import { getAppointments } from '../controllers/appointmentController.js';
const router = express.Router();

router.post('/book', authenticate, bookAppointment);
router.get('/view', getAppointments);


export default router;
