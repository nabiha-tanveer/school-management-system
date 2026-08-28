import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, date, status } = await req.json();

    if (!studentId || !date || !status) {
      return NextResponse.json(
        { error: "studentId, date, and status are required" },
        { status: 400 }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date: new Date(date),
        status,
      },
    });

    return NextResponse.json(
      { message: "Attendance marked successfully", attendance },
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

    const attendance = await prisma.attendance.findMany({
      where: studentId ? { studentId } : {},
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ attendance }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}