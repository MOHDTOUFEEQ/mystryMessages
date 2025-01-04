import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("auth-token")?.value || '';
    
    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Verify the token
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    
    return decodedToken.id;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
