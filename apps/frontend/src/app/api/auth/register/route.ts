import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";
import { emailValidator, passwordValidator } from "../../../../lib/validators";
import { z } from "zod";

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: emailValidator,
  password: passwordValidator,
  role: z.enum(["CUSTOMER", "DELIVERY"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password, role } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
      },
    });

    // -------- create JWT ----------
    if (!process.env.JWT_SECRET)
      throw new Error("JWT_SECRET missing in env");

    const token = jwt.sign(
      { userId: user.id, role: user.role },   // payload
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    // --------------------------------

    return NextResponse.json(
      {
        message: "User registered successfully",
        token,                 // ⬅ send token
        role: user.role,       // ⬅ send role
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error, please try again." }, { status: 500 });
  }
}
