import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided." }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Remove password safely without destructuring
    const userCopy: Omit<typeof user, "password"> & { password?: string } = { ...user };
    delete userCopy.password;

    return NextResponse.json({ user: userCopy }, { status: 200 });
  } catch (error) {
    console.error("Token error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 401 }
    );
  }
}
