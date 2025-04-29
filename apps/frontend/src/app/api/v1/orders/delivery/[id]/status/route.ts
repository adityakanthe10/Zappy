import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { z } from "zod";
import { getSocket } from "../../../../../../../../../server/src/services/socket";
import { cookies } from "next/headers";

const Body = z.object({
  status: z.enum(["ACCEPTED", "OUT_FOR_DELIVERY", "DELIVERED"]),
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let userId: string;
  let role: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = decoded.userId;
    role = decoded.role;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (role !== "DELIVERY") {
    return NextResponse.json(
      { error: "Only delivery partners allowed" },
      { status: 403 }
    );
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

  // After updating in database
  const io = getSocket();
  io.emit("orderStatusUpdated", { orderId: id, newStatus: parsed.data.status });

  return NextResponse.json({ order }, { status: 200 });
}
