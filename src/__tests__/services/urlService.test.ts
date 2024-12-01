import UrlService from '../../services/urlService';
import ShortUrl from '../../models/shortUrl';
import { ApiError } from '../../utils/apiError';

jest.mock('../../models/shortUrl');

describe('UrlService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a short url successfully', async () => {
      const mockShortUrl = {
        id: '123',
        originalUrl: 'https://example.com',
        shortCode: 'abc123',
        clicks: 0,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (ShortUrl.create as jest.Mock).mockResolvedValue(mockShortUrl);

      const result = await UrlService.createShortUrl({
        originalUrl: 'https://example.com'
      });

      expect(result).toEqual(mockShortUrl);
      expect(ShortUrl.create).toHaveBeenCalled();
    });
  });

  describe('getUserUrls', () => {
    it('should return user urls', async () => {
      const mockUrls = [
        {
          id: '123',
          originalUrl: 'https://example.com',
          shortCode: 'abc123',
          clicks: 0,
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      (ShortUrl.findAll as jest.Mock).mockResolvedValue(mockUrls);

      const result = await UrlService.getUserUrls('user123');

      expect(result).toEqual(mockUrls);
      expect(ShortUrl.findAll).toHaveBeenCalledWith({
        where: { userId: 'user123', deletedAt: null },
        order: [['createdAt', 'DESC']]
      });
    });

    it('should throw error if userId is not provided', async () => {
      await expect(UrlService.getUserUrls('')).rejects.toThrow(ApiError);
    });
  });
}); 