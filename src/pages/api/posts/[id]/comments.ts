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
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: { author: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(comments);
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        authorId: userId,
      },
      include: { author: { select: { id: true, name: true, image: true } } },
    });

    return res.status(201).json(comment);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
