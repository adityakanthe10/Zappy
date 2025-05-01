export const runtime = 'nodejs'; // 👈 Add this
// import jwt from 'jsonwebtoken';
// your existing code...


import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { z } from "zod";

//  Request Schema
const BodySchema = z.object({
  product: z.string(),
  quantity: z.number().positive(),
  location: z.string(),
});

//POST /orders
export async function POST(req: NextRequest) {
  try {
    // Auth Check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    // Decode and verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
    };

    // Only CUSTOMERS can place orders, not ADMIN or DELIVERY
    if (payload.role !== "CUSTOMER") {
      return NextResponse.json(
        { error: "Only customers can place orders" },
        { status: 403 }
      );
    }

    // Validate Body
    const body = await req.json();
    console.log("body", body);
    const parsed = BodySchema.safeParse(body);
    console.log("parsed", parsed);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.message },
        { status: 400 }
      );
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        product: parsed.data.product,
        quantity: parsed.data.quantity,
        location: parsed.data.location,
        status: "PENDING",
        customer: { connect: { id: payload.userId } },
      },
    });
    console.log("order", order);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
