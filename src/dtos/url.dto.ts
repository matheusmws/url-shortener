import { ICreateUrlDto, IUpdateUrlDto, IUrlResponseDto } from "@/types";

export interface CreateUrlDto {
  originalUrl: string;
  userId?: string | null;
}

export interface UpdateUrlDto {
  originalUrl: string;
  shortCode: string;
  userId: string;
}

export interface UrlResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId?: string | null;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}
