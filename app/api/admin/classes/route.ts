import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, section, teacherId } = await req.json();

    if (!name || !section || !teacherId) {
      return NextResponse.json(
        { error: "Name, section, and teacherId are required" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: { name, section, teacherId },
    });

    return NextResponse.json(
      { message: "Class created successfully", class: newClass },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
  include: {
    teacher: { select: { id: true, name: true, email: true } },
    students: { select: { id: true, name: true, email: true } },
  },
});
    return NextResponse.json({ classes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}