import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param file The File object from an input element
 * @param path The path in storage (e.g., 'products', 'content')
 * @returns The download URL string
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!file) throw new Error("No file provided");

  // Create a unique filename using timestamp
  const extension = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
  const fullPath = `${path}/${filename}`;

  const storageRef = ref(storage, fullPath);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
