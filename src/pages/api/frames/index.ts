import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';

type ResponseData = unknown;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const session = await getServerSession(req, res, authOptions);

  switch (req.method) {
    case 'POST': {
      const { name, description, endpointId, username, password, variant, orientation } = req.body;

      if (session?.user?.email) {
        const result = await prisma.frame.create({
          data: {
            name,
            description,
            endpointId,
            username,
            password,
            variant,
            orientation,
            owner: { connect: { email: session?.user?.email } },
          },
        });
        return res.json(result);
      } else {
        return res.status(401).send(`Can't connect frame to user, since user has no email.`);
      }
    }
    default: {
      return res.status(405).send(`Method not allowed.`);
    }
  }
}
