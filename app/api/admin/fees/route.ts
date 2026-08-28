import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, amount, status, dueDate } = await req.json();

    if (!studentId || !amount || !dueDate) {
      return NextResponse.json(
        { error: "studentId, amount, and dueDate are required" },
        { status: 400 }
      );
    }

    const fee = await prisma.fees.create({
      data: {
        studentId,
        amount,
        status: status || "UNPAID",
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(
      { message: "Fee record created successfully", fee },
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

    const fees = await prisma.fees.findMany({
      where: studentId ? { studentId } : {},
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json({ fees }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}