/**
 * Compresses and crops an uploaded image file to a centered square Data URI
 * (max 256x256px) so it stays well within Firestore's 200KB field size limit.
 */
export async function compressProfileImage(
  file: File,
  maxSize = 256,
  quality = 0.85
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (JPG, PNG, WebP, or GIF).');
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image file is too large (max 10MB).');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));
    reader.onload = (event) => {
      const rawDataUri = event.target?.result as string;
      if (!rawDataUri) {
        reject(new Error('Image file could not be loaded.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Selected file is not a supported image format.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = maxSize;
          canvas.height = maxSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve(rawDataUri);
            return;
          }

          // Center-crop to square
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, maxSize, maxSize);
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxSize, maxSize);

          let compressed = canvas.toDataURL('image/jpeg', quality);
          // Fallback lower quality if still above 150KB
          if (compressed.length > 150000) {
            compressed = canvas.toDataURL('image/jpeg', 0.65);
          }
          resolve(compressed);
        } catch {
          resolve(rawDataUri);
        }
      };
      img.src = rawDataUri;
    };
    reader.readAsDataURL(file);
  });
}
