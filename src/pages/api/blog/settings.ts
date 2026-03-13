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
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        blogTitle: true,
        themeColor: true,
        bgmUrl: true,
        image: true,
      },
    });
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    const { username, bio, blogTitle, themeColor, bgmUrl, name } = req.body;

    // Check username uniqueness
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } },
      });
      if (existing) {
        return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username !== undefined && { username }),
        ...(bio !== undefined && { bio }),
        ...(blogTitle !== undefined && { blogTitle }),
        ...(themeColor !== undefined && { themeColor }),
        ...(bgmUrl !== undefined && { bgmUrl }),
        ...(name !== undefined && { name }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        blogTitle: true,
        themeColor: true,
        bgmUrl: true,
        image: true,
      },
    });

    return res.status(200).json(user);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
