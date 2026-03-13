import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import formidable from 'formidable';
import { authOptions } from '@/lib/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  form.parse(req, (err, _fields, files) => {
    if (err) {
      return res.status(400).json({ message: '파일 업로드에 실패했습니다.' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const filename = path.basename(file.filepath);
    const url = `/uploads/${filename}`;

    return res.status(200).json({ url, filename });
  });
}
