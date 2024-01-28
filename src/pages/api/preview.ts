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

  const pngFiles: string[] = [];

  fs.readdir(temporaryDirectory, (err, files) => {
    if (err) console.log(err);
    else {
      console.log('\nCurrent directory filenames:');

      files.forEach((file) => {
        if (path.extname(file) == '.png') {
          console.log(file);
          pngFiles.push(file);
        }
      });

      if (pngFiles.length) {
        // Select first file
        const filePath = pngFiles[pngFiles.length - 1];
        const imageBuffer = fs.readFileSync(path.join(temporaryDirectory, filePath));

        res.setHeader('Content-Type', 'image/png');
        return res.send(imageBuffer);
      } else {
        return res.send('No file so preview');
      }
    }
  });
}
