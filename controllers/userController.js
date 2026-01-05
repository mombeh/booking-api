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

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
};
