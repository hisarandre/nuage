export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 à 1
  mimeType?: 'image/jpeg' | 'image/webp';
}

export async function compressImageUtil(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.8,
    mimeType = 'image/webp',
  } = options;

  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Impossible de créer le contexte canvas');

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  );

  if (!blob) throw new Error('Échec de la compression');

  const newName = file.name.replace(/\.[^.]+$/, mimeType === 'image/webp' ? '.webp' : '.jpg');

  return new File([blob], newName, { type: mimeType });
}
