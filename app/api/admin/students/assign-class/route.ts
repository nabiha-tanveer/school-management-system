import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { studentId, classId } = await req.json();

    if (!studentId || !classId) {
      return NextResponse.json(
        { error: "studentId and classId are required" },
        { status: 400 }
      );
    }

    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { classId },
    });

    return NextResponse.json(
      { message: "Student assigned to class successfully", student: updatedStudent },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}