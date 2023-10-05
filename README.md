# Image Proxy Service

```
http://localhost:4000/image
  /resize:200:200
  /quality:40
  /greyscale
  /url/https://.../my-image-1.jpg
  @avif
```

```
http://localhost:4000/image
  /blur:80
  /resize:200
  /url/https://.../my-image-2.jpg
  @webp
```

⚠️ This is a basic implementation intended for educational purposes and does not meet all production requirements.
However, it provides a great foundation for further development.

Based on [node-file-router](https://github.com/Danilqa/node-file-router) and [sharp](https://github.com/lovell/sharp).

## Features

1. Resize
2. Compress
3. Change format
4. Greyscale
5. Tint
6. Blur

## Start

1. Install dependencies:\
   `pnpm install`
2. Run a script:\
   `pnpm dev`
3. Open `localhost:4000`


## Examples

Several working examples can be found in `examples.html`
