import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { classId, subject, day, timeSlot } = await req.json();

    if (!classId || !subject || !day || !timeSlot) {
      return NextResponse.json(
        { error: "classId, subject, day, and timeSlot are required" },
        { status: 400 }
      );
    }

    const entry = await prisma.timetable.create({
      data: { classId, subject, day, timeSlot },
    });

    return NextResponse.json(
      { message: "Timetable entry created successfully", entry },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    const timetable = await prisma.timetable.findMany({
      where: classId ? { classId } : {},
    });

    return NextResponse.json({ timetable }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}