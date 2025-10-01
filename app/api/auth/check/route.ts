import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "4553bb0d0d2ca0c72c97fea120b28639b96ed60d3e03e866e4d892790f62e097"; // It's better to use an environment variable for the secret key

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return new NextResponse("Missing token", { status: 401 });
  }

  try {
    jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ authorized: true });
  } catch (error) {
    return new NextResponse("Invalid token", { status: 401 });
  }
}
