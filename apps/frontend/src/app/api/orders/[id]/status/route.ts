import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/db';
import { z } from 'zod';

const Body = z.object({
  status: z.enum(['ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED']),
});

// interface Context {
//   params: {
//     id: string;
//   };
// }

interface JwtPayload {
  userId: string;
  role: string;
}

export async function PUT(req: NextRequest, {params}:{params:Promise<{id:string}>}) {
  const { id } = await params;

  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let userId: string;
  let role: string;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET!) as JwtPayload;
    userId = decoded.userId;
    role = decoded.role;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (role !== 'DELIVERY') {
    return NextResponse.json({ error: 'Only delivery partners allowed' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      deliveryPartner: { connect: { id: userId } },
    },
  });

  return NextResponse.json({ order }, { status: 200 });
}
