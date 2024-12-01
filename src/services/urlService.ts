import ShortUrl from '../models/shortUrl';
import crypto from 'crypto';
import { CreateUrlDto, UpdateUrlDto } from '../dtos/url.dto';
import { ApiError } from '../utils/apiError';

class UrlService {
  static async createShortUrl(data: CreateUrlDto): Promise<ShortUrl> {
    const shortCode = await this.generateUniqueShortCode();

    if (!data.originalUrl) throw new ApiError('originalUrl cannot be null', 400);
    
    const shortUrl = await ShortUrl.create({
      originalUrl: data.originalUrl,
      shortCode,
      userId: data.userId || null
    });

    return shortUrl;
  }

  static async generateUniqueShortCode(): Promise<string> {
    let shortCode: string = '';
    let isUnique = false;

    while (!isUnique) {
      shortCode = crypto.randomBytes(3).toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, 6);
      
      const existing = await ShortUrl.findOne({ 
        where: { shortCode, deletedAt: null } 
      });
      
      if (!existing) {
        isUnique = true;
      }
    }

    return shortCode;
  }

  static async getUserUrls(userId: string): Promise<ShortUrl[]> {
    if (!userId) {
      throw new ApiError('User ID is required', 400);
    }

    return ShortUrl.findAll({
      where: { 
        userId,
        deletedAt: null 
      },
      order: [['createdAt', 'DESC']]
    });
  }

  static async updateUrl(shortCode: string, data: UpdateUrlDto, userId: string): Promise<ShortUrl> {
    const shortUrl = await ShortUrl.findOne({
      where: { shortCode, userId, deletedAt: null }
    });

    if (!shortUrl) {
      throw new ApiError('URL not found', 404);
    }

    shortUrl.originalUrl = data.originalUrl;
    await shortUrl.save();
    return shortUrl;
  }

  static async deleteUrl(shortCode: string, userId: string): Promise<boolean> {
    const shortUrl = await ShortUrl.findOne({
      where: { shortCode, userId, deletedAt: null }
    });

    if (!shortUrl) {
      throw new ApiError('URL not found', 404);
    }

    shortUrl.deletedAt = new Date();
    await shortUrl.save();
    return true;
  }

  static async redirectUrl(shortCode: string): Promise<string> {
    const shortUrl = await ShortUrl.findOne({
      where: { shortCode, deletedAt: null }
    });

    if (!shortUrl) {
      throw new ApiError('URL not found', 404);
    }

    shortUrl.clicks += 1;
    await shortUrl.save();

    return shortUrl.originalUrl;
  }
}

export default UrlService; 