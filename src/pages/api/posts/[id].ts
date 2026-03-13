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
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true, email: true } },
        category: true,
        comments: {
          include: { author: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { likes: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    return res.status(200).json(post);
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  if (req.method === 'PUT') {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    if (existing.authorId !== userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    const { title, content, image, categoryId } = req.body;
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, image, categoryId },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return res.status(200).json(post);
  }

  if (req.method === 'DELETE') {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }
    if (existing.authorId !== userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await prisma.post.delete({ where: { id } });
    return res.status(200).json({ message: '삭제되었습니다.' });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
