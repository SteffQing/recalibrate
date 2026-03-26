import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      institution,
      occupation,
      sex,
      location,
      hearAbout,
      isLeader,
      leaderOffice,
      expectations,
    } = body;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !institution?.trim() ||
      !occupation?.trim() ||
      !sex?.trim() ||
      !location?.trim() ||
      !hearAbout?.trim() ||
      !expectations?.trim()
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const existing = await prisma.registration.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This email has already been registered." },
        { status: 409 },
      );
    }

    const registration = await prisma.registration.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        institution: institution.trim(),
        occupation: occupation.trim(),
        sex,
        location: location.trim(),
        hearAbout,
        isLeader: isLeader === true || isLeader === "true",
        leaderOffice: isLeader ? leaderOffice?.trim() || null : null,
        expectations: expectations.trim(),
      },
    });

    return NextResponse.json(
      {
        message:
          "Registration successful! We look forward to seeing you at Recalibrate.",
        id: registration.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
