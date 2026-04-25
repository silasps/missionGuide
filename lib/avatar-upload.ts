import { randomUUID } from "crypto";

export function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

export function buildAvatarFilePath(userId: string, filename: string) {
  const ext = getFileExtension(filename) || "jpg";
  return `${userId}/${randomUUID()}.${ext}`;
}