//routes/providers
import express from 'express';
import { registerProvider, loginProvider } from '../controllers/providerController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { providerRegisterSchema, providerLoginSchema } from '../validator/providerValidator.js';

const router = express.Router();

router.post('/register', validateRequest(providerRegisterSchema), registerProvider);
router.post('/login', validateRequest(providerLoginSchema), loginProvider);

export default router;
