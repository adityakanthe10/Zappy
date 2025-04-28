// app/api/orders/pending/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

interface JwtPayload {
  role: string;
}

export async function GET(req: NextRequest) {
  try {
    // Get the cookie named "token" (adjust name if your cookie is named differently)
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    const { role } = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Allow only ADMIN and DELIVERY
    if (role !== "DELIVERY" && role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch pending orders
    const orders = await prisma.order.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/orders/pending:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
