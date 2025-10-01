import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY =
  "4553bb0d0d2ca0c72c97fea120b28639b96ed60d3e03e866e4d892790f62e097"; // It's better to use an environment variable for the secret key

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === "soab42.genexa") {
    const token = jwt.sign({ isAdmin: true }, SECRET_KEY, { expiresIn: "1h" });
    return NextResponse.json({ token });
  } else {
    return new NextResponse("Invalid password", { status: 401 });
  }
}
