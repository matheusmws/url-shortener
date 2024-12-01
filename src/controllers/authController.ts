import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IRegisterUserDto, ILoginUserDto } from '../types';
import { logger } from '../config/observability';
import AuthService from '../services/authService';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const {  email, password }: IRegisterUserDto = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already registered' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      logger.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: ILoginUserDto = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || '123',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.json({ token });
    } catch (error) {
      logger.error('Error logging in:', error);
      res.status(500).json({ error: 'Error logging in' });
    }
  }
} 