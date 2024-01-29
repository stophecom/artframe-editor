import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = Buffer | string; // We send compressed image data

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // const temporaryDirectory = path.join(__dirname, 'tmp');
  const temporaryDirectory = '/tmp';

  if (!fs.existsSync(temporaryDirectory)) {
    return res.send('No tmp folder.');
  }

  const files = fs.readdirSync(temporaryDirectory);
  const pngFiles: string[] = [];
  files.forEach((file) => {
    if (path.extname(file) == '.png') {
      pngFiles.push(file);
    }
  });

  if (pngFiles.length) {
    // Select last file
    const filePath = pngFiles[pngFiles.length - 1];
    const imageBuffer = fs.readFileSync(path.join(temporaryDirectory, filePath));

    res.setHeader('Content-Type', 'image/png');
    return res.send(imageBuffer);
  } else {
    return res.send('No file so preview');
  }
}
