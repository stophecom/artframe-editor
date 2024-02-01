import zlib from 'zlib';

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import sharp from 'sharp';

import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

type ResponseData = Buffer | string; // We send compressed image data

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const id = req.query.id as string;
  const session = await getServerSession(req, res, authOptions);

  // Preview Mode for debugging. It will display the image to be shown.
  const isPreviewMode = session && req.query['preview'] === 'true';

  switch (req.method) {
    // In the ArtFrame settings we specify the URL as follows:
    // https://username:password@example.com/api/frames/xyz
    // Every ArtFrame uses a specific username and password
    // Every frame uses a unique endpoint. "xyz" corresponds to the frame endpoint id.
    case 'GET': {
      const frameByEndpointId = await prisma.frame.findFirst({
        where: {
          endpointId: id,
        },
      });

      // Check Basic Authorization
      const auth = Buffer.from(`${frameByEndpointId?.username}:${frameByEndpointId?.password}`).toString('base64');
      const authorizationHeader = req.headers.authorization;

      if (!isPreviewMode && authorizationHeader !== `Basic ${auth}`) {
        return res.status(401).setHeader('WWW-Authenticate', 'Basic').send('Not authorized.');
      }

      // Todo. Select correct image
      const firstImage = await prisma.image.findFirst({
        where: {
          frameId: frameByEndpointId?.id,
        },
        orderBy: {
          scheduledAt: { sort: 'desc', nulls: 'last' },
        },
      });

      if (!firstImage) {
        return res.status(401).send('No image found.');
      }

      // Fetch image Vercel Blob
      const imageBlob = await (await fetch(firstImage.url)).blob();
      const imageArrayBuffer = await imageBlob.arrayBuffer();

      // If preview mode is set we send the original image.
      if (isPreviewMode) {
        res.setHeader('Content-Type', imageBlob.type);
        return res.send(Buffer.from(imageArrayBuffer));
      }

      // Timeout to next image
      // Uses Cache-Control
      const ARTFRAME_LIFECYCLE = 6; // the ArtFrame takes 2 secs to boot, and approximately another 4 to connect to WiFi and download an image
      const sleep_time = 60 * 60 * 24 - ARTFRAME_LIFECYCLE;

      // Prepare image for ArtFrame
      const sharpImage = sharp(imageArrayBuffer);

      // Read Image Metadata
      const metadata = await sharpImage.metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      // Convert to grayscale
      // FYI. The function gives slightly different values compared to Python PIL: Image.open(image_path).convert('L')
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
      res.setHeader('Width', width);
      res.setHeader('Height', height);
      res.setHeader('Cache-Control', `max-age=${sleep_time}`);
      return res.send(compressed);
    }
  }
}
