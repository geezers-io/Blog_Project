import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { q } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ message: '검색어를 입력해주세요.' });
  }

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      OR: [{ title: { contains: q } }, { content: { contains: q } }],
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: true,
      _count: { select: { comments: true, likes: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return res.status(200).json({ posts, total: posts.length });
}
