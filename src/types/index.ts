import { Request } from 'express';

export interface IUser {
  id?: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUrl {
  id?: number;
  originalUrl: string;
  shortCode: string;
  userId: number;
  visits: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IJwtPayload {
  id: number;
  userId?: number;
  email: string;
}

export interface IAuthRequest extends Request {
  user?: IJwtPayload;
}

export interface IRegisterUserDto {
  email: string;
  password: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}

export interface ICreateUrlDto {
  originalUrl: string;
}

export interface IUpdateUrlDto {
  originalUrl: string;
  shortCode?: string;
}

export interface IUrlResponseDto {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  visits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
} 