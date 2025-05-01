import express from 'express';
import { viewTimeSlots } from '../controllers/timeslotController.js';
import { createSlot } from '../controllers/timeslotController.js';
import { authenticate } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/create', authenticate, createSlot);
router.get('/view', protect, viewTimeSlots);

export default router;
