import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const userHeader = req.headers.get("user");
    const user = userHeader ? JSON.parse(userHeader) : null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason, fromDate, toDate } = await req.json();

    if (!reason || !fromDate || !toDate) {
      return NextResponse.json(
        { error: "reason, fromDate, and toDate are required" },
        { status: 400 }
      );
    }

    const leave = await prisma.leave.create({
      data: {
        userId: user.userId,
        reason,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
    });

    return NextResponse.json(
      { message: "Leave application submitted successfully", leave },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}