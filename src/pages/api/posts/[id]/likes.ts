import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  if (req.method === 'GET') {
    const count = await prisma.like.count({ where: { postId: id } });
    let liked = false;

    const session = await getServerSession(req, res, authOptions);
    const userId = (session?.user as any)?.id;
    if (userId) {
      const existing = await prisma.like.findUnique({
        where: { postId_userId: { postId: id, userId } },
      });
      liked = !!existing;
    }

    return res.status(200).json({ count, liked });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId: id, userId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.status(200).json({ liked: false });
    }

    await prisma.like.create({
      data: { postId: id, userId },
    });

    return res.status(200).json({ liked: true });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
