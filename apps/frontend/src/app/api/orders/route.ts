// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { z } from 'zod';

const BodySchema = z.object({
  product:  z.string().min(1),
  quantity: z.number().int().positive(),
  location: z.string().min(1),
});

export async function POST(req: NextRequest) {
  /* --- auth -------------------------------------------------------- */
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const token = auth.split(' ')[1];
  const secret = process.env.JWT_SECRET!;
  let payload: { userId: string; role: string };
  try {
    payload = jwt.verify(token, secret) as { userId: string; role: string };
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  if (payload.role !== 'CUSTOMER')
    return NextResponse.json({ error: 'Only customers can place orders' }, { status: 403 });

  /* --- validation -------------------------------------------------- */
  const body = await req.json();
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  /* --- create order ------------------------------------------------ */
  const order = await prisma.order.create({
    data: {
      product:  parsed.data.product,
      quantity: parsed.data.quantity,
      location: parsed.data.location,
      status:   'PENDING',
      customer: { connect: { id: payload.userId } },
    },
  });
  return NextResponse.json({ order }, { status: 201 });
}
