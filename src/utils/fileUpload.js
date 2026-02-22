import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Resizer from 'react-image-file-resizer';
import { storage } from '../firebase';

export const compressImage = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(file, 600, 600, 'JPEG', 80, 0, (uri) => resolve(uri), 'file');
  });

export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};
