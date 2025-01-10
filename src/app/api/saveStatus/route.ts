import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../helpers/getDataFromToken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Parse request payload
    const payload = await req.json();
    console.log("Received payload:", payload);
    
    if (!payload || !payload._id || typeof payload.status !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid payload structure or status is not a boolean" },
        { status: 400 }
      );
    }

    // Extract token data and validate user
    const tokenData = getDataFromToken(req);
    const id = tokenData;
    if (!id || !tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userID = new mongoose.Types.ObjectId(id);
    if (!userID) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Update the user's message status
    const update = await UserModel.findOneAndUpdate(
      { _id: userID, "messages._id": payload._id },
      { $set: { "messages.$.status": payload.status } }, 
      { new: true } 
    );
    if (!update) {
      return NextResponse.json(
        { error: "Message not found or update failed" },
        { status: 400 }
      );
    }

    // Return success message
    return NextResponse.json(
      { message: "Status saved successfully", data: update },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in saving status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
