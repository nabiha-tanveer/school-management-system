import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const userHeader = req.headers.get("user");
  const user = userHeader ? JSON.parse(userHeader) : null;

  return NextResponse.json({
    message: "You accessed a protected admin route!",
    user,
  });
}