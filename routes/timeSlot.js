//routes/timeslot.js
import express from 'express';
import { viewTimeSlots, updateSlot, deleteSlot } from '../controllers/timeslotController.js';
import { createSlot } from '../controllers/timeslotController.js';
import { authenticate } from '../middleware/authmiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { timeSlotSchema } from '../validator/timeslotValidator.js';
// import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();
/**
 * @swagger
 * /timeslot:
 *   post:
 *     summary: Create a timeslot
 *     tags: [Tasks]
 *     description: Creates a new timeslot  for either the authenticated cient or service provider.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: Buy groceries }
 *               description: { type: string, nullable: true, example: Milk, Bread, Eggs }
 *               completed: { type: boolean, default: false, example: false }
 *               dueDate: { type: string, format: date, nullable: true, example: 2024-12-31 }
 *     responses:
 *       201:
 *         description: Timeslot created successfully.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Timeslot' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.post('/create', authenticate, validateRequest(timeSlotSchema), createSlot);

/**
 * @swagger
 * /timeslot:
 *   get:
 *     summary: Get available timeslot
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The requested timeslot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Timeslot' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
router.get('/view',authenticate, viewTimeSlots);
 router.put('/:id', authenticate, validateRequest(timeSlotSchema), updateSlot);
 router.delete('/delete/:id', authenticate, deleteSlot);

export default router;
