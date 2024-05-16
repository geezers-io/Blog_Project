import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function GET(request) {
  const token = await getToken({ req: request });
  return NextResponse.json(token);
}
