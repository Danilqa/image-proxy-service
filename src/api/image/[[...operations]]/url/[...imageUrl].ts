import { processImage } from '../../../../services/image-processor';
import type { IncomingMessage, ServerResponse } from 'node:http';

interface RouteParams {
  operations: string[];
  imageUrl: string[];
}

export default async function ImageProcessor(
  _: IncomingMessage,
  res: ServerResponse,
  routeParams: RouteParams
) {
  const { operations = [] } = routeParams;
  const imageUrl = routeParams.imageUrl.join('/');

  return processImage(operations, imageUrl, res);
}
