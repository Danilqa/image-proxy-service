import https from 'node:https';
import { pipeline } from 'node:stream';
import { HttpError } from '../errors/http-error';
import { safeFit, safeFormat } from '../type-guards/type-guards';
import { toNumber } from '../utils/number.utils';
import sharp from 'sharp';
import type { Sharp } from 'sharp';
import type { ImageProcessorOperations } from '../types/image-processor';
import type { Writable } from 'stream';

export function processImage(
  operations: string[],
  imageUrl: string,
  outputStream: Writable
): Promise<void> {
  return new Promise((resolve, reject) => {
    const [originalImageUrl, newFormat] = imageUrl.split('@');
    const [originalFormat] = originalImageUrl.split('.').reverse();

    const sharpOperations: ImageProcessorOperations<Sharp> = {
      resize: (instance) => (width, height, fit, position) =>
        instance.resize(toNumber(width), toNumber(height), {
          fit: safeFit(fit),
          position
        }),
      greyscale: (instance) => () => instance.greyscale(),
      tint: (instance) => (r, g, b) =>
        instance.tint({ r: toNumber(r), g: toNumber(g), b: toNumber(b) }),
      blur: (instance) => (radius) => instance.blur(toNumber(radius))
    };

    let quality: number | undefined;
    const transformedImage = sharp();
    operations.forEach((operation) => {
      const [name, ...args] = operation.split(':');

      if (name === 'quality') {
        quality = toNumber(args[0]);
        return;
      }

      if (name in sharpOperations) {
        sharpOperations[name](transformedImage)(...args);
        return;
      }

      throw new HttpError(`${name} is not supported`, 405);
    });

    if (newFormat || quality) {
      transformedImage.toFormat(
        safeFormat(newFormat || originalFormat),
        quality ? { quality } : undefined
      );
    }

    outputStream.on('end', resolve);

    https
      .get(originalImageUrl, (originImageRes) => {
        if (originImageRes.statusCode !== 200) {
          reject(
            new HttpError(
              `Failed to fetch the image. The response code is ${originImageRes.statusCode}`,
              500
            )
          );
        }

        pipeline(originImageRes, transformedImage, outputStream, (err) => {
          if (!err) return;

          outputStream.end();
          reject(
            new HttpError(`Image processing was failed ${err?.message}`, 500)
          );
        });
      })
      .on('error', (err) => {
        reject(new HttpError(`Error fetching the image: ${err.message}`, 500));
      });
  });
}
