export const imageValidationUtils = {
  isValidImage: (file: File): boolean =>
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg',

  isUnder5MB: (file: File): boolean => file.size <= 5 * 1024 * 1024,

  hasMinimumResolution: (
    file: File,
    callback: (valid: boolean, url: string) => void,
  ): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width >= 300 && img.height >= 300) {
          callback(true, url);
        } else {
          callback(false, url);
        }
      };
      img.onerror = () => callback(false, url);
      img.src = url;
    };
    reader.readAsDataURL(file);
  },

  enhanceImageQuality: (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          // Redimensionar manteniendo proporción
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const aspectRatio = width / height;
            if (aspectRatio > 1) {
              width = MAX_WIDTH;
              height = MAX_WIDTH / aspectRatio;
            } else {
              height = MAX_HEIGHT;
              width = MAX_HEIGHT * aspectRatio;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No se pudo obtener el contexto del canvas');

          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const copy = new Uint8ClampedArray(data);

          const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
          const applyKernel = (x: number, y: number, c: number) => {
            let sum = 0;
            let i = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const px = x + kx;
                const py = y + ky;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  const pixelIdx = (py * width + px) * 4 + c;
                  sum += copy[pixelIdx] * kernel[i];
                }
                i++;
              }
            }
            return Math.min(255, Math.max(0, sum));
          };
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              for (let c = 0; c < 3; c++) {
                const pixelIdx = (y * width + x) * 4 + c;
                data[pixelIdx] = applyKernel(x, y, c);
              }
            }
          }

          ctx.putImageData(imageData, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject('No se pudo generar la imagen mejorada');
            },
            'image/jpeg',
            0.92,
          );
        };
        img.onerror = () => reject('No se pudo cargar la imagen');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(file);
    });
  },
};
