//routes/users
import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validator/userValidator.js';

const router = express.Router();

/* GET users listing. */
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser)
export default router;
