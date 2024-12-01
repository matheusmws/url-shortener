const AuthService = require('../../src/services/authService');
import User from '../../src/models/User';

// Mock do User
jest.mock('../../src/models/user');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      const mockUser = {
        id: 1,
        email,
        password: hashedPassword
      };

      User.findOne.mockResolvedValue(null);
      User.hashPassword.mockResolvedValue(hashedPassword);
      User.create.mockResolvedValue(mockUser);

      const result = await AuthService.register(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ 
        where: { email, deletedAt: null } 
      });
      expect(User.create).toHaveBeenCalledWith({
        email,
        password: hashedPassword
      });
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('deve lançar erro se email já existir', async () => {
      const email = 'existing@example.com';
      const password = 'senha123';
      
      User.findOne.mockResolvedValue({ id: 1, email });

      await expect(AuthService.register(email, password))
        .rejects
        .toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = {
        id: 1,
        email,
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await AuthService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ 
        where: { email, deletedAt: null } 
      });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('deve lançar erro se usuário não existir', async () => {
      const email = 'nonexistent@example.com';
      const password = 'senha123';
      
      User.findOne.mockResolvedValue(null);

      await expect(AuthService.login(email, password))
        .rejects
        .toThrow('User not found');
    });

    it('deve lançar erro se senha for inválida', async () => {
      const email = 'test@example.com';
      const password = 'wrong_password';
      const mockUser = {
        id: 1,
        email,
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockResolvedValue(mockUser);

      await expect(AuthService.login(email, password))
        .rejects
        .toThrow('Invalid password');
    });
  });
}); 