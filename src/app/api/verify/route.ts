import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Pattern: RC-[RANDOM8]-[ID]-[RANDOM4]
    const match = code.match(/^RC-[A-Z0-9]{8}-(\d+)-[A-Z0-9]{4}$/);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 },
      );
    }

    const id = parseInt(match[1], 10);

    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        phoneNumber: registration.phoneNumber,
        isMinister: registration.isMinister,
        ministryDetails: registration.ministryDetails,
        isFellowshipLeader: registration.isFellowshipLeader,
        fellowshipDetails: registration.fellowshipDetails,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
