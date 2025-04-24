// app/api/orders/customer/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return NextResponse.json({ error: 'Auth' }, { status: 401 });
  const token = auth.split(' ')[1];
  interface JwtPayload {
    userId: string;
    role: string;
  }
  const { userId, role } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (role !== 'CUSTOMER' || userId !== params.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const orders = await prisma.order.findMany({
    where: { customerId: params.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ orders }, { status: 200 });
}
