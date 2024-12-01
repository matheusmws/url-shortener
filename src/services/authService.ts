import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { UserResponseDto } from '../dtos/user.dto';
import User from '../models/User';
import { ApiError } from '../utils/apiError';

class AuthService {
  static async register(data: RegisterDto): Promise<UserResponseDto> {
    const existingUser = await User.findOne({
      where: { email: data.email }
    });

    if (existingUser) {
      throw ApiError.badRequest('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      email: data.email,
      password: hashedPassword
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  static async login(data: LoginDto): Promise<{ token: string; user: UserResponseDto }> {
    const user = await User.findOne({
      where: { email: data.email }
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user.toJSON();
    return {
      token,
      user: userWithoutPassword
    };
  }

  static async validateToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw ApiError.unauthorized('Invalid token');
    }
  }
}

export default AuthService; 