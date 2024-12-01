import User from '@/models/User';
import AuthService from '../../services/authService';
import { ApiError } from '../../utils/apiError';
import bcrypt from 'bcrypt';

jest.mock('../../models/user');
jest.mock('bcrypt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: () => ({
          id: '123',
          email: 'test@example.com',
          password: 'hashedPassword'
        })
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.register({
          email: 'test@example.com',
          password: 'password123'
      });

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ id: '123' });

      await expect(
        AuthService.register({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow(ApiError);
    });
  });
}); 