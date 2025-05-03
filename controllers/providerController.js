// controller/providerController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { findUserByEmail } from '../model/userModel.js';
import { createProvider, findProviderByUserId } from '../model/providerModel.js';


export const registerProvider = async (req, res) => {
    try {
      const { email, serviceName } = req.body;
  
      // Find user by email
      const user = await findUserByEmail(email);
      console.log('User found:', user); // Log the user to verify
  
      if (!user) {
        return res.status(404).json({ message: 'User must register first as a user' });
      }
  
      // Check if provider is already registered
      const existingProvider = await findProviderByUserId(user.id);
      if (existingProvider) {
        return res.status(400).json({ message: 'User is already registered as a provider' });
      }
  
      // Register provider
      const newProvider = await createProvider(user.id, serviceName);
      res.status(201).json({ message: 'Provider registered successfully', provider: newProvider });
    } catch (err) {
      console.error('Provider Register Error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };

export const loginProvider = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if user is a registered provider
      const provider = await findProviderByUserId(user.id);
      if (!provider) {
        return res.status(403).json({ message: 'Access denied: Not a service provider' });
      }

      const payload = {
        id: provider.id,
        email: user.email,
        role: 'provider', // You can include a role or other information in the token
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  
      res.status(200).json({
        message: 'Login successful',
        token,
        provider,
      });
    } catch (err) {
      console.error('Provider Login Error:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
