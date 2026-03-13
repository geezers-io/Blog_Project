import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query;
  if (typeof username !== 'string') {
    return res.status(400).json({ message: 'Invalid username' });
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { name: username }],
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        bio: true,
        blogTitle: true,
        themeColor: true,
        bgmUrl: true,
        todayVisits: true,
        totalVisits: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: '블로그를 찾을 수 없습니다.' });
    }

    // Increment visit count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        todayVisits: { increment: 1 },
        totalVisits: { increment: 1 },
      },
    });

    const posts = await prisma.post.findMany({
      where: { authorId: user.id, published: true },
      include: {
        category: true,
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Collect tags
    const tagSet = new Set<string>();
    posts.forEach(p => {
      if (p.tags) {
        p.tags.split(',').forEach(t => tagSet.add(t.trim()));
      }
    });

    return res.status(200).json({
      user: { ...user, todayVisits: user.todayVisits + 1, totalVisits: user.totalVisits + 1 },
      posts: JSON.parse(JSON.stringify(posts)),
      tags: Array.from(tagSet),
    });
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
