import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "ihk_";
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStoragePercent(used: number, plan: string): number {
  const limits: Record<string, number> = {
    free: 1 * 1024 * 1024 * 1024,
    pro: 100 * 1024 * 1024 * 1024,
    business: 1024 * 1024 * 1024 * 1024,
  };
  const limit = limits[plan] || limits.free;
  return Math.min((used / limit) * 100, 100);
}

export function getStorageLimit(plan: string): number {
  const limits: Record<string, number> = {
    free: 1 * 1024 * 1024 * 1024,
    pro: 100 * 1024 * 1024 * 1024,
    business: 1024 * 1024 * 1024 * 1024,
  };
  return limits[plan] || limits.free;
}
