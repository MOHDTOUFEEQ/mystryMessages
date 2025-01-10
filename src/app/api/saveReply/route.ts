import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "../../helpers/getDataFromToken";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";

export async function POST(req: NextRequest) {
  await dbConnect(); // Ensure database connection is established

  try {
    // Parse request payload
    const  payload  = await req.json();
    console.log("im payload",payload);
    
    if (!payload || !payload._id || !payload.reply) {
      return NextResponse.json(
        { error: "Invalid payload structure" },
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
    // Update the user's message reply
    const update = await UserModel.findOneAndUpdate(
      { _id: userID, "messages._id": payload._id }, // Match user and specific message
      { $set: { "messages.$.reply": payload.reply } }, // Update the reply field
      { new: true } // Return the updated document
    );

    if (update) {
      return NextResponse.json(
        { message: "Reply saved successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Error while saving the reply" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in saving reply:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
