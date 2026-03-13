import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const { name, image } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, image },
      select: { id: true, name: true, email: true, image: true },
    });

    return res.status(200).json(user);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
