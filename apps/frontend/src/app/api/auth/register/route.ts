import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import { emailValidator, passwordValidator } from "@/lib/validators";
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

    return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }

    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error, please try again." }, { status: 500 });
  }
}
