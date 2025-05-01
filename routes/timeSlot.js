//routes/timeslot.js
import express from 'express';
import { viewTimeSlots, updateSlot, deleteSlot } from '../controllers/timeslotController.js';
import { createSlot } from '../controllers/timeslotController.js';
import { authenticate } from '../middleware/authmiddleware.js';
// import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/create', authenticate, createSlot);
router.get('/view',authenticate, viewTimeSlots);
router.put('/:id', authenticate, updateSlot);
router.delete('/delete/:id', authenticate, deleteSlot);

export default router;
