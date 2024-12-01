const { authMiddleware, requireAuth } = require('../../src/middlewares/auth');
const jwt = require('jsonwebtoken');
import User from '../../src/models/User';

jest.mock('jsonwebtoken');
jest.mock('../../src/models/User');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('authMiddleware', () => {
    it('deve passar sem token', async () => {
      await authMiddleware(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockReq.user).toBeNull();
    });

    it('deve autenticar com token válido', async () => {
      const token = 'valid_token';
      const decodedToken = { id: 1, email: 'test@example.com' };
      const mockUser = { id: 1, email: 'test@example.com' };

      mockReq.headers.authorization = `Bearer ${token}`;
      jwt.verify.mockReturnValue(decodedToken);
      User.findOne.mockResolvedValue(mockUser);

      await authMiddleware(mockReq, mockRes, nextFunction);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(User.findOne).toHaveBeenCalledWith({ 
        where: { id: decodedToken.id, deletedAt: null } 
      });
      expect(mockReq.user).toEqual(mockUser);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve rejeitar token inválido', async () => {
      mockReq.headers.authorization = 'Bearer invalid_token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      await authMiddleware(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Token inválido' });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    it('deve permitir acesso com usuário autenticado', () => {
      mockReq.user = { id: 1 };

      requireAuth(mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve negar acesso sem usuário autenticado', () => {
      requireAuth(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Autenticação necessária' 
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
}); 