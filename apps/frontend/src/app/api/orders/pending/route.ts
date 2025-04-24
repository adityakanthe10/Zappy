// app/api/orders/pending/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Auth' }, { status: 401 });
  interface JwtPayload {
    role: string;
  }
  const { role } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as JwtPayload;
  if (role !== 'DELIVERY')
    return NextResponse.json({ error: 'Only delivery partners' }, { status: 403 });

  const orders = await prisma.order.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ orders }, { status: 200 });
}
