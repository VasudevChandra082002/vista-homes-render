// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/lib/firebase";
// import { v4 as uuidv4 } from "uuid";

// export const uploadFilesToFirebase = async (
//   files: File[],
//   folder: string = "uploads"
// ): Promise<string[]> => {
//   try {
//     const uploadPromises = files.map(async (file) => {
//       const fileName = `${folder}/${uuidv4()}_${file.name}`;
//       const fileRef = ref(storage, fileName);
//       const snapshot = await uploadBytes(fileRef, file);
//       return await getDownloadURL(snapshot.ref);
//     });
//     return await Promise.all(uploadPromises);
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// };

// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/lib/firebase";
// import { v4 as uuidv4 } from "uuid"; // For generating unique filenames

// export const uploadFilesToFirebase = async (file, folder = "uploads") => {
//   try {
//     // Generate a unique filename for the file
//     const fileName = `${folder}/${uuidv4()}_${file.name}`;
//     const fileRef = ref(storage, fileName);

//     // Upload the file to Firebase Storage
//     const snapshot = await uploadBytes(fileRef, file);
    
//     // Get the downloadable URL for the uploaded file
//     const downloadURL = await getDownloadURL(snapshot.ref);
//     return downloadURL;
//   } catch (error) {
//     console.error("Error uploading file to Firebase:", error);
//     throw error;
//   }
// };

// src/lib/upload.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

type UploadInput = File | Blob;
type UploadMany = UploadInput[] | FileList;

/** Safely get a base name */
function safeBaseName(f: UploadInput, idx = 0) {
  const anyFile = f as File;
  const hasName = typeof anyFile.name === "string" && anyFile.name.trim().length > 0;
  const ext = (anyFile.type && anyFile.type.split("/")[1]) || "bin";
  return hasName ? anyFile.name : `file_${idx}.${ext}`;
}

/** Upload a single File/Blob and return its download URL */
export async function uploadOneToFirebase(
  file: UploadInput,
  folder = "uploads",
  idx = 0
): Promise<string> {
  const baseName = safeBaseName(file, idx);
  const uniqueName = `${uuidv4()}_${baseName}`;
  const path = `${folder}/${uniqueName}`;
  const fileRef = ref(storage, path);

  const metadata = { contentType: (file as any).type || "application/octet-stream" };
  const snap = await uploadBytes(fileRef, file, metadata);
  return await getDownloadURL(snap.ref);
}

/** Upload many files (File[], FileList) */
export async function uploadFilesToFirebase(
  files: UploadMany,
  folder = "uploads"
): Promise<string[]> {
  const arr = Array.from(files as any);
  const urls: string[] = [];
  for (let i = 0; i < arr.length; i++) {
    urls.push(await uploadOneToFirebase(arr[i], folder, i));
  }
  return urls;
}
