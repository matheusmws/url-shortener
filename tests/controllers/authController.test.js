const AuthController = require('../../src/controllers/authController');
const AuthService = require('../../src/services/authService');

jest.mock('../../src/services/authService');

describe('AuthController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('register', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const token = 'mock_token';
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      AuthService.register.mockResolvedValue(token);

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ token });
    });

    it('deve retornar erro quando registro falha', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      const error = new Error('Erro no registro');
      AuthService.register.mockRejectedValue(error);

      await AuthController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const token = 'mock_token';
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      AuthService.login.mockResolvedValue(token);

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ token });
    });

    it('deve retornar erro quando login falha', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrong_password'
      };
      const error = new Error('Credenciais inválidas');
      AuthService.login.mockRejectedValue(error);

      await AuthController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
}); 