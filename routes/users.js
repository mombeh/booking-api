//routes/users
import express from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validator/userValidator.js';

const router = express.Router();

/* GET users listing. */
/**
 *
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName: { type: string, example: Nadine }
 *               lastName: { type: string, example: Nkwenui }
 *               email: { type: string, format: email, example: ngoran@example.com }
 *               password: { type: string, format: password, example: P@word123 }
 *     responses:
 *       201:
 *         description: User registered successfully.
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

router.post('/register', validateRequest(registerSchema), registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token.
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
router.post('/login', validateRequest(loginSchema), loginUser)
export default router;
