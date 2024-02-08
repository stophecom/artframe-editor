import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

type ResponseData = Buffer | string; // We send compressed image data

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const id = req.query.id as string;

  const session = await getServerSession(req, res, authOptions);

  // User not signed in
  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  switch (req.method) {
    case 'POST': {
      const { name, description, variant, orientation } = req.body;

      await prisma.frame.update({
        where: { id: id },
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
