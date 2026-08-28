import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, subject, marks } = await req.json();

    if (!studentId || !subject || marks === undefined) {
      return NextResponse.json(
        { error: "studentId, subject, and marks are required" },
        { status: 400 }
      );
    }

    const result = await prisma.result.create({
      data: { studentId, subject, marks },
    });

    return NextResponse.json(
      { message: "Result added successfully", result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    const results = await prisma.result.findMany({
      where: studentId ? { studentId } : {},
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}