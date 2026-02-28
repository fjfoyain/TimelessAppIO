import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./firebase";

// ─── Constants ───────────────────────────────────────────────────

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav"];

// ─── Validation ──────────────────────────────────────────────────

export function validateFile(
  file: File,
  options: { maxSize: number; allowedTypes: string[] }
): { valid: boolean; error?: string } {
  if (!options.allowedTypes.includes(file.type)) {
    const names = options.allowedTypes.map((t) => t.split("/")[1].toUpperCase());
    return { valid: false, error: `Invalid file type. Allowed: ${names.join(", ")}` };
  }
  if (file.size > options.maxSize) {
    const mb = Math.round(options.maxSize / (1024 * 1024));
    return { valid: false, error: `File too large. Maximum size: ${mb}MB` };
  }
  return { valid: true };
}

// ─── Core Upload ─────────────────────────────────────────────────

export async function uploadFile(
  file: File,
  storagePath: string,
  onProgress?: (progress: number) => void
): Promise<{ downloadURL: string; fullPath: string }> {
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadURL, fullPath: uploadTask.snapshot.ref.fullPath });
      }
    );
  });
}

// ─── Convenience Uploads ─────────────────────────────────────────

export async function uploadAvatar(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const v = validateFile(file, { maxSize: MAX_IMAGE_SIZE, allowedTypes: ALLOWED_IMAGE_TYPES });
  if (!v.valid) throw new Error(v.error);

  const ext = file.name.split(".").pop() || "jpg";
  const result = await uploadFile(file, `avatars/${userId}/avatar.${ext}`, onProgress);
  return result.downloadURL;
}

export async function uploadServiceImage(
  serviceId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const v = validateFile(file, { maxSize: MAX_IMAGE_SIZE, allowedTypes: ALLOWED_IMAGE_TYPES });
  if (!v.valid) throw new Error(v.error);

  const ext = file.name.split(".").pop() || "jpg";
  const result = await uploadFile(file, `services/${serviceId}/image.${ext}`, onProgress);
  return result.downloadURL;
}

export async function uploadEventImage(
  eventId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const v = validateFile(file, { maxSize: MAX_IMAGE_SIZE, allowedTypes: ALLOWED_IMAGE_TYPES });
  if (!v.valid) throw new Error(v.error);

  const ext = file.name.split(".").pop() || "jpg";
  const result = await uploadFile(file, `events/${eventId}/image.${ext}`, onProgress);
  return result.downloadURL;
}

export async function uploadArtistDemo(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const v = validateFile(file, { maxSize: MAX_AUDIO_SIZE, allowedTypes: ALLOWED_AUDIO_TYPES });
  if (!v.valid) throw new Error(v.error);

  const ext = file.name.split(".").pop() || "mp3";
  const result = await uploadFile(file, `artists/${userId}/demo/demo.${ext}`, onProgress);
  return result.downloadURL;
}

export async function uploadArtistPortfolio(
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const v = validateFile(file, {
    maxSize: MAX_AUDIO_SIZE,
    allowedTypes: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES, "video/mp4"],
  });
  if (!v.valid) throw new Error(v.error);

  const ext = file.name.split(".").pop() || "file";
  const result = await uploadFile(file, `artists/${userId}/portfolio/${Date.now()}.${ext}`, onProgress);
  return result.downloadURL;
}

// ─── Delete ──────────────────────────────────────────────────────

export async function deleteFile(storagePath: string): Promise<void> {
  const storageRef = ref(storage, storagePath);
  await deleteObject(storageRef);
}
