const UrlService = require('../../src/services/urlService');
const ShortUrl = require('../../src/models/shortUrl');

// mock da URL
jest.mock('../../src/models/shortUrl');

describe('UrlService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('deve criar uma URL curta com sucesso', async () => {
      const originalUrl = 'https://example.com/long-url';
      const userId = 1;
      const mockShortUrl = {
        id: 1,
        originalUrl,
        shortCode: 'abc123',
        userId
      };

      ShortUrl.create.mockResolvedValue(mockShortUrl);
      ShortUrl.findOne.mockResolvedValue(null);

      const result = await UrlService.createShortUrl(originalUrl, userId);

      expect(ShortUrl.create).toHaveBeenCalled();
      expect(result).toEqual(mockShortUrl);
    });
  });

  describe('getUserUrls', () => {
    it('deve retornar as URLs do usuário', async () => {
      const userId = 1;
      const mockUrls = [
        { id: 1, shortCode: 'abc123', originalUrl: 'https://example.com/1' },
        { id: 2, shortCode: 'def456', originalUrl: 'https://example.com/2' }
      ];

      ShortUrl.findAll.mockResolvedValue(mockUrls);

      const result = await UrlService.getUserUrls(userId);

      expect(ShortUrl.findAll).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        order: [['createdAt', 'DESC']]
      });
      expect(result).toEqual(mockUrls);
    });
  });

  describe('updateUrl', () => {
    it('deve atualizar URL com sucesso', async () => {
      const shortCode = 'abc123';
      const userId = 1;
      const newOriginalUrl = 'https://example.com/new-url';
      const mockShortUrl = {
        id: 1,
        shortCode,
        originalUrl: 'https://example.com/old-url',
        userId,
        save: jest.fn()
      };

      ShortUrl.findOne.mockResolvedValue(mockShortUrl);

      const result = await UrlService.updateUrl(shortCode, newOriginalUrl, userId);

      expect(ShortUrl.findOne).toHaveBeenCalledWith({
        where: { shortCode, userId, deletedAt: null }
      });
      expect(mockShortUrl.save).toHaveBeenCalled();
      expect(result).toEqual(mockShortUrl);
    });

    it('deve lançar erro ao atualizar URL inexistente', async () => {
      const shortCode = 'nonexistent';
      const userId = 1;
      const newOriginalUrl = 'https://example.com/new-url';

      ShortUrl.findOne.mockResolvedValue(null);

      await expect(UrlService.updateUrl(shortCode, newOriginalUrl, userId))
        .rejects
        .toThrow('URL not found');
    });
  });

  describe('redirectUrl', () => {
    it('deve incrementar clicks e retornar URL original', async () => {
      const shortCode = 'abc123';
      const mockShortUrl = {
        originalUrl: 'https://example.com/original',
        clicks: 0,
        save: jest.fn()
      };

      ShortUrl.findOne.mockResolvedValue(mockShortUrl);

      const result = await UrlService.redirectUrl(shortCode);

      expect(ShortUrl.findOne).toHaveBeenCalledWith({
        where: { shortCode, deletedAt: null }
      });
      expect(mockShortUrl.clicks).toBe(1);
      expect(mockShortUrl.save).toHaveBeenCalled();
      expect(result).toBe(mockShortUrl.originalUrl);
    });

    it('deve lançar erro para shortCode inexistente', async () => {
      const shortCode = 'nonexistent';

      ShortUrl.findOne.mockResolvedValue(null);

      await expect(UrlService.redirectUrl(shortCode))
        .rejects
        .toThrow('URL not found');
    });
  });
}); 