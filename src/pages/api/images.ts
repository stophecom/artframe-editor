import fs from 'fs';

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

  // Remove header
  const base64Image = image.split(';base64,').pop();
  // Write file to file system
  fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
    console.log('File created');
  });

  res.status(200).json({ message: 'Hello from Next.js!' });
}
