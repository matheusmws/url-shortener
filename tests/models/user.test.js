const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
import User from '../../src/models/User';

// mock do signup
jest.mock('bcryptjs');

describe('User Model', () => {
  describe('hashPassword', () => {
    it('deve criar o hash da senha', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await User.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('deve comparar senha corretamente', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      const user = new User({ password: hashedPassword });
      bcrypt.compare.mockResolvedValue(true);

      const result = await user.comparePassword(password);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });
  });
}); 