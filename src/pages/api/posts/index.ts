import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { category, sort, page = '1', limit = '10', search } = req.query;

    const where: any = { published: true };
    if (category && typeof category === 'string') {
      where.category = { name: category };
    }
    if (search && typeof search === 'string') {
      where.OR = [{ title: { contains: search } }, { content: { contains: search } }];
    }

    const orderBy: any = {};
    if (sort === 'oldest') {
      orderBy.createdAt = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return res.status(200).json({
      posts,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  }

  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { title, content, image, categoryId } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용은 필수입니다.' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        categoryId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return res.status(201).json(post);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
