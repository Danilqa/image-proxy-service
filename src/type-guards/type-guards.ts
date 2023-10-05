import { HttpError } from '../errors/http-error';
import { AVAILABLE_FORMATS } from '../config';
import { fit as sharpFit } from 'sharp';
import type { FitEnum, FormatEnum } from 'sharp';

export function isFit(maybeFit: unknown): maybeFit is keyof FitEnum {
  return (
    typeof maybeFit === 'string' && Object.keys(sharpFit).includes(maybeFit)
  );
}

export function safeFit(maybeFit: unknown): keyof FitEnum | undefined {
  if (!maybeFit) return undefined;
  if (isFit(maybeFit)) return maybeFit;

  throw new HttpError(`Fit ${maybeFit} is not valid`, 405);
}

export function safeFormat(maybeFormat: unknown): keyof FormatEnum {
  if (!maybeFormat) {
    throw new HttpError('No format is specified', 500);
  }

  if (
    typeof maybeFormat === 'string' &&
    includes(AVAILABLE_FORMATS, maybeFormat)
  ) {
    return maybeFormat;
  }

  throw new HttpError(`${maybeFormat} format is not supported`, 405);
}

function includes<T extends U, U>(coll: ReadonlyArray<T>, el: U): el is T {
  return coll.includes(el as T);
}
