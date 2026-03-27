//routes/providers
import express from 'express';
import { registerProvider, loginProvider } from '../controllers/providerController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { providerRegisterSchema, providerLoginSchema } from '../validator/providerValidator.js';
import { getProvidersWithTimeSlots } from '../controllers/providerController.js'; // ✅ Add this

const router = express.Router();
router.get('/view', getProvidersWithTimeSlots); 

export default router;
