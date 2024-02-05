import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../../../../lib/prisma';
import { authOptions } from '../../auth/[...nextauth]';

type ResponseData = Buffer | string; // We send compressed image data

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const id = req.query.id as string;

  const session = await getServerSession(req, res, authOptions);

  // User not signed in
  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  switch (req.method) {
    case 'DELETE': {
      await prisma.frame.delete({
        where: {
          id: id,
        },
      });
      return res.send('Frame deleted');
    }
    default: {
      return res.status(405).send(`Method not allowed.`);
    }
  }
}
