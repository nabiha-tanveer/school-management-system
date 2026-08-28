import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
    const totalClasses = await prisma.class.count();

    const totalAttendance = await prisma.attendance.count();
    const presentCount = await prisma.attendance.count({ where: { status: "PRESENT" } });
    const attendancePercentage =
      totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const pendingLeaves = await prisma.leave.count({ where: { status: "PENDING" } });

    const totalFeesCollected = await prisma.fees.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    const totalFeesPending = await prisma.fees.aggregate({
      where: { status: "UNPAID" },
      _sum: { amount: true },
    });

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      attendancePercentage,
      pendingLeaves,
      feesCollected: totalFeesCollected._sum.amount || 0,
      feesPending: totalFeesPending._sum.amount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}