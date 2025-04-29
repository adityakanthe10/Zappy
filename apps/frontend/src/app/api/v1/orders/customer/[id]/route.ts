// app/api/orders/customer/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

interface JwtPayload {
  userId: string;
  role: "ADMIN" | "CUSTOMER";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // console.log("id", id);
  //  Read token from cookies instead of header
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
  // console.log("payload",payload)
  const { userId, role } = payload;
  // console.log("role",role)

  //  Check permissions
  if (role === "CUSTOMER" && userId !== id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  //  Admin can access anyone's orders, Customer can access only their own
  const orders = await prisma.order.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders }, { status: 200 });
}
