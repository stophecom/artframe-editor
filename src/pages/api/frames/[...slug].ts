import { put } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Set desired value here
    },
  },
};

type ResponseData = Buffer | string; // We send compressed image data
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const session = await getServerSession(req, res, authOptions);

  // We expect either "/api/frames/<frame id>" or "/api/frames/<frame id>/images"
  const { slug } = req.query;
  if (!slug) {
    return res.status(401).send('Missing id');
  }

  const frameId = slug[0] as string;

  // To store images for a frame we expect "/api/frames/<frame id>/images"
  const isImageRequest = slug[1] === 'images';

  // User not signed in
  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  switch (req.method) {
    case 'POST': {
      if (isImageRequest) {
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
            frame: { connect: { id: frameId } },
          },
        });

        console.log(result);

        return res.status(200).json('File saved.');
      }

      // If slug only contains id we handle the frame
      const { name, description, variant, orientation } = req.body;

      await prisma.frame.update({
        where: { id: frameId },
        data: {
          name,
          description,
          variant,
          orientation,
        },
      });
      return res.send('Frame updated');
    }

    case 'DELETE': {
      await prisma.frame.delete({
        where: {
          id: frameId,
        },
      });
      return res.send('Frame deleted');
    }
    default: {
      return res.status(405).send(`Method not allowed.`);
    }
  }
}
