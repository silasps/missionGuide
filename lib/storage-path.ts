function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "jpg";
}

export function buildStoragePath(folder: string, userId: string, filename: string) {
  const ext = getFileExtension(filename) || "jpg";
  return `${folder}/${userId}/${generateId()}.${ext}`;
}