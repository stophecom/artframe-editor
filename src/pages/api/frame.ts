import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';

type ResponseData = Buffer; // We send compressed image data

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // const temporaryDirectory = path.join(__dirname, 'tmp');
  const temporaryDirectory = '/tmp';

  console.log('read temp folder', temporaryDirectory);

  if (!fs.existsSync(temporaryDirectory)) {
    throw Error('No tmp folder found.');
  }

  const files = fs.readdirSync(temporaryDirectory);
  const pngFiles: string[] = [];

  files.forEach((file) => {
    if (path.extname(file) == '.png') {
      pngFiles.push(file);
    }
  });

  if (!pngFiles.length) {
    throw Error('No PNG files found.');
  }

  // Select last file
  const filePath = pngFiles[pngFiles.length - 1];

  const imageBuffer = fs.readFileSync(path.join(temporaryDirectory, filePath));
  const sharpImage = sharp(imageBuffer);

  // Timeout to next image
  // Uses Cache-Control
  const ARTFRAME_LIFECYCLE = 6; // the ArtFrame takes 2 secs to boot, and approximately another 4 to connect to WiFi and download an image
  const sleep_time = 60 * 60 * 24 - ARTFRAME_LIFECYCLE;

  // Metadata
  const metadata = await sharpImage.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Convert to grayscale
  // FYI. The function gives slightly different values as Python PIL: Image.open(image_path).convert('L')
  const grayscaleBuffer = await sharpImage.grayscale().raw().toBuffer();

  // Convert to 4bit
  const buf = Buffer.alloc(Math.floor(width * height) / 2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const value = grayscaleBuffer[i] / 16;

      if (i % 2 === 0) {
        buf[i >> 1] |= value;
      } else {
        buf[i >> 1] |= value << 4;
      }
    }
  }

  // Compress zlib
  // The python equivalent is "zlib.compress(raw, level=9)"
  // This is error prone since node/python use slightly different naming: https://stackoverflow.com/questions/47652769/zlib-node-js-cant-extract-compressed-data-from-python
  const compressed = zlib.deflateSync(buf, { level: 9 });

  // We need to pass width & height of the image. Corresponds to the frame's display.
  res.setHeader('Width', 1448);
  res.setHeader('Height', 1072);
  res.setHeader('Cache-Control', `max-age=${sleep_time}`);
  return res.send(compressed);
}
