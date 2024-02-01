import { put } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]';
import prisma from '../../../lib/prisma';

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
  switch (req.method) {
    case 'POST': {
      const session = await getServerSession(req, res, authOptions);

      const frames = await prisma.frame.findMany({
        include: {
          owner: {
            select: { name: true },
          },
        },
      });

      console.log(frames);

      // User not signed in
      if (!session) {
        res.status(401).send({ message: 'Unauthorized' });
      }

      console.log('Session', JSON.stringify(session, null, 2));

      // Save image to Vercel Blob
      const image = await req.body;
      const base64Image = image.split(';base64,').pop();

      const blob = await put(`${Date.now()}.png`, Buffer.from(base64Image, 'base64'), {
        access: 'public',
      });

      // @todo
      const scheduledDate = new Date();
      scheduledDate.setHours(scheduledDate.getHours() + 2);

      // Save image data in DB
      const result = await prisma.image.create({
        data: {
          pathname: blob.pathname,
          contentType: blob.contentType,
          url: blob.url,
          scheduledAt: scheduledDate,
          frame: { connect: { id: 'cls29h5yo0000kob5vnthcmq4' } },
        },
      });

      console.log(result);

      res.status(200).json({ message: 'File saved.' });
      break;
    }
    default: {
      res.status(405).send({ message: 'Method not allowed' });
    }
  }
}
