import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return NextResponse.json(
        { error: "User not found. Signup Please" },
        { status: 404 }
      );

    // Compare provided password with stored hash
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });

    // Check if JWT_SECRET is set in environment variables
    if (!process.env.JWT_SECRET)
      return NextResponse.json(
        { error: "JWT_SECRET not set." },
        { status: 500 }
      );

    // Determine role: user can be CUSTOMER, DELIVERY, or ADMIN
    const role = user.role as "CUSTOMER" | "DELIVERY" | "ADMIN";

    // Generate JWT token with a 2-hour expiration
    const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set cookies for token and role, with 2 hours expiration
    const res = NextResponse.json(
      {
        message: "Login successful",
        token, // JWT token
        role, // User role (can be CUSTOMER, DELIVERY, or ADMIN)
      },
      { status: 200 }
    );

    // Set cookies using `NextResponse.cookies.set`
    res.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });
    res.cookies.set("role", role, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
