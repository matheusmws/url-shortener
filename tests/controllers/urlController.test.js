const UrlController = require('../../src/controllers/urlController');
const UrlService = require('../../src/services/urlService');

jest.mock('../../src/services/urlService');

describe('UrlController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      redirect: jest.fn()
    };
  });

  describe('createShortUrl', () => {
    it('deve criar URL curta sem autenticação', async () => {
      const originalUrl = 'https://example.com/long-url';
      const shortCode = 'abc123';
      mockReq.body = { originalUrl };
      
      UrlService.createShortUrl.mockResolvedValue({ shortCode });

      await UrlController.createShortUrl(mockReq, mockRes);

      expect(UrlService.createShortUrl).toHaveBeenCalledWith(originalUrl, null);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        shortUrl: `${process.env.BASE_URL}/${shortCode}`
      });
    });

    it('deve criar URL curta com autenticação', async () => {
      const originalUrl = 'https://example.com/long-url';
      const shortCode = 'abc123';
      const userId = 1;
      mockReq.body = { originalUrl };
      mockReq.user = { id: userId };
      
      UrlService.createShortUrl.mockResolvedValue({ shortCode });

      await UrlController.createShortUrl(mockReq, mockRes);

      expect(UrlService.createShortUrl).toHaveBeenCalledWith(originalUrl, userId);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getUserUrls', () => {
    it('deve retornar URLs do usuário', async () => {
      const userId = 1;
      const mockUrls = [
        { shortCode: 'abc123', originalUrl: 'https://example.com/1' },
        { shortCode: 'def456', originalUrl: 'https://example.com/2' }
      ];
      mockReq.user = { id: userId };
      
      UrlService.getUserUrls.mockResolvedValue(mockUrls);

      await UrlController.getUserUrls(mockReq, mockRes);

      expect(UrlService.getUserUrls).toHaveBeenCalledWith(userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUrls);
    });
  });

  describe('updateUrl', () => {
    it('deve atualizar URL com sucesso', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com/new-url';
      const userId = 1;
      mockReq.params = { shortCode };
      mockReq.body = { originalUrl };
      mockReq.user = { id: userId };
      
      const updatedUrl = { shortCode, originalUrl };
      UrlService.updateUrl.mockResolvedValue(updatedUrl);

      await UrlController.updateUrl(mockReq, mockRes);

      expect(UrlService.updateUrl).toHaveBeenCalledWith(shortCode, originalUrl, userId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(updatedUrl);
    });
  });

  describe('deleteUrl', () => {
    it('deve deletar URL com sucesso', async () => {
      const shortCode = 'abc123';
      const userId = 1;
      mockReq.params = { shortCode };
      mockReq.user = { id: userId };
      
      UrlService.deleteUrl.mockResolvedValue(true);

      await UrlController.deleteUrl(mockReq, mockRes);

      expect(UrlService.deleteUrl).toHaveBeenCalledWith(shortCode, userId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe('redirect', () => {
    it('deve redirecionar para URL original', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com/original';
      mockReq.params = { shortCode };
      
      UrlService.redirectUrl.mockResolvedValue(originalUrl);

      await UrlController.redirect(mockReq, mockRes);

      expect(UrlService.redirectUrl).toHaveBeenCalledWith(shortCode);
      expect(mockRes.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('deve retornar 404 para URL not found', async () => {
      const shortCode = 'nonexistent';
      mockReq.params = { shortCode };
      
      UrlService.redirectUrl.mockRejectedValue(new Error('URL not found'));

      await UrlController.redirect(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'URL not found' });
    });
  });
}); 