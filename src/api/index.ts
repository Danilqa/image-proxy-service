import type { IncomingMessage, ServerResponse } from 'node:http';

export default function HomePage(_: IncomingMessage, res: ServerResponse) {
  res.end('<h1>Welcome to Image Proxy Server!</h1>');
}
