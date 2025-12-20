//controllers/usercontroler
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../model/userModel.js';

import { createProvider } from '../model/providerModel.js';

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, serviceName } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser(
    firstName,
    lastName,
    email,
    hashedPassword,
    role
  );

  // 👇 If provider, create provider profile
  if (role === 'provider') {
    await createProvider(user.id, serviceName);
  }

  res.status(201).json({
    message: 'User registered',
    user
  });
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
