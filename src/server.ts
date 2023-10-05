import * as http from 'node:http';
import { HttpError } from './errors/http-error';
import { initFileRouter } from 'node-file-router';
import type { ServerResponse } from 'node:http';

function handleError(error: Error | HttpError, res: ServerResponse) {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  res.writeHead(statusCode).end(`<h1>Error</h1><p>${error.message}</p>`);
}

async function run() {
  const useFileRouter = await initFileRouter({
    baseDir: `${__dirname}/api`
  });

  const server = http.createServer(async (req, res) => {
    try {
      await useFileRouter(req, res);
    } catch (err) {
      handleError(err, res);
    }
  });

  const port = 4000;
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
  });
}

run();
