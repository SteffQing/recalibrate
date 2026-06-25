import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    const adminPasscode = process.env.ADMIN_PASSCODE;

    if (!adminPasscode) {
      return NextResponse.json(
        { error: "Admin access is not configured." },
        { status: 500 },
      );
    }

    const normalize = (v: unknown) => String(v ?? "").trim().toLowerCase();

    if (!passcode || normalize(passcode) !== normalize(adminPasscode)) {
      return NextResponse.json(
        { error: "Incorrect passcode." },
        { status: 401 },
      );
    }

    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ count: registrations.length, registrations });
  } catch (error) {
    console.error("Admin registrations error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
