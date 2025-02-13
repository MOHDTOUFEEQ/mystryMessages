import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";


const checkUsernameUniqueSchema = z.object({
  username: usernameValidation,
});

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
      const { searchParams } = new URL(req.url);
      const username = searchParams.get("username");
      if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
      }
      const parsed = checkUsernameUniqueSchema.safeParse({ username });
      if (!parsed.success) {
        let errorMessage = "";
        parsed.error.errors.forEach((error) => {
          errorMessage += error.message + " ";
        });
        return NextResponse.json({ error: errorMessage.length > 0 ? errorMessage : "Invalid username" }, { status: 400 });
      }

    const user = await UserModel.findOne({ username });
    if (user) {
      return NextResponse.json({ error: "Username already exists", }, { status: 400 });
    }
    return NextResponse.json({ unique: true, message: "Username is unique" }, { status: 200 });
  } catch (error) {
    console.error("Error: ", error); // Log the error to help with debugging
    
    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An unknown error occurred", // Providing the error message if it's available
      },
      { status: 500 }
    );
  }
}
