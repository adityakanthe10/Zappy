// app/api/orders/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { z } from 'zod';

const Body = z.object({
  status: z.enum(['ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED']),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer '))
    return NextResponse.json({ error: 'Auth' }, { status: 401 });

  interface JwtPayload {
    userId: string;
    role: string;
  }

  const { userId, role } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as JwtPayload;
  if (role !== 'DELIVERY')
    return NextResponse.json({ error: 'Only delivery partners' }, { status: 403 });

  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      deliveryPartner: { connect: { id: userId } },
    },
  });

  return NextResponse.json({ order }, { status: 200 });
}
