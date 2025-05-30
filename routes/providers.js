//routes/providers
import express from 'express';
import { registerProvider, loginProvider } from '../controllers/providerController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { providerRegisterSchema, providerLoginSchema } from '../validator/providerValidator.js';
import { getProvidersWithTimeSlots } from '../controllers/providerController.js'; // ✅ Add this

const router = express.Router();
/**
 *
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as provider
 *     tags: [Authentication]
 *     description: Creates a provider account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - serviceName
 *             properties:
 *               email: { type: string, format: email, example: ngoran@example.com }
 *               serviceName: { type: string }
 *     responses:
 *       201:
 *         description: Provider registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User registered successfuly! }
 *                 userId:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *       400:
 *         description: Validation error (e.g., passwords don't match, invalid email).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */

router.post('/register', validateRequest(providerRegisterSchema), registerProvider);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in as provider
 *     tags: [Authentication]
 *     description: Authenticates a provider and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: john.doe@example.com }
 *               password: { type: string, format: password, example: P@sswOrd123 }
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Login successful! }
 *                 token: { type: string, description: JWT token for authentication }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Validation error (e.g., missing fields).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Invalid credentials (email not found or password incorrect).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during login.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */
router.post('/login', validateRequest(providerLoginSchema), loginProvider);
router.get('/view', getProvidersWithTimeSlots); 

export default router;
