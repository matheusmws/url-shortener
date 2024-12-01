import { Request, Response, NextFunction } from 'express';
import UrlService from '../services/urlService';
import { CreateUrlDto, UpdateUrlDto } from '../dtos/url.dto';
import { ApiError } from '../utils/apiError';

export class UrlController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const urlData: CreateUrlDto = {
        originalUrl: req.body.originalUrl,
        userId: req.userId
      };

      const shortUrl = await UrlService.createShortUrl(urlData);
      res.status(201).json(shortUrl);
    } catch (error) {
      next(error);
    }
  }

  static async getUserUrls(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new ApiError('Authentication required', 401);
      }
      const urls = await UrlService.getUserUrls(req.userId);
      res.json(urls);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new ApiError('Authentication required', 401);
      }
      const { shortCode } = req.params;
      const urlData: UpdateUrlDto = {
        originalUrl: req.body.originalUrl,
        shortCode,
        userId: req.userId
      };

      const updatedUrl = await UrlService.updateUrl(shortCode, urlData, req.userId);
      res.json(updatedUrl);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new ApiError('Authentication required', 401);
      }
      const { shortCode } = req.params;
      await UrlService.deleteUrl(shortCode, req.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async redirect(req: Request, res: Response, next: NextFunction) {
    try {
      const { shortCode } = req.params;
      const originalUrl = await UrlService.redirectUrl(shortCode);
      res.redirect(originalUrl);
    } catch (error) {
      next(error);
    }
  }
}

export default UrlController; 