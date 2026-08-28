
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { fromDate: "desc" },
    });

    return NextResponse.json({ leaves }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { leaveId, status } = await req.json();

    if (!leaveId || !status) {
      return NextResponse.json(
        { error: "leaveId and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.leave.update({
      where: { id: leaveId },
      data: { status },
    });

    return NextResponse.json(
      { message: "Leave status updated successfully", leave: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}