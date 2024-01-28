import fs from 'fs';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const image = await req.body;

  // const temporaryDirectory = path.join(__dirname, 'tmp');
  const temporaryDirectory = '/tmp';

  // On Vercel we can create a temporary folder to store images.
  // Should be replaced with an object storage solution. E.g. AWS S3
  fs.mkdir(temporaryDirectory, { recursive: true }, (err) => {
    if (err) throw err;
    console.log('Temporary folder created.');
  });

  const imagePath = path.join(temporaryDirectory, `${Date.now()}.png`);

  // Remove header
  const base64Image = image.split(';base64,').pop();
  // Write file to file system
  fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, function (err) {
    console.log('File saved to temporary folder: ', temporaryDirectory);
    if (err) throw err;
  });

  res.status(200).json({ message: 'File saved to temporary folder.' });
}
