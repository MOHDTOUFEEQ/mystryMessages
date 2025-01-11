import { NextResponse } from "next/server";
import UserModel from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

import { getDataFromToken } from '../../../helpers/getDataFromToken'; 

// Establish database connection
await dbConnect();

export async function GET(request, { params }) {
    try {
        const { username } = params;

        // Find user ID by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userID = user._id;
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
        }

        // Fetch and aggregate messages for the user
        const messages = await UserModel.aggregate([
            { $match: { _id: userID } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } },
        ]);

        if (!messages || messages.length === 0) {
            return NextResponse.json({ success: true, message: "No messages found" }, { status: 200 });
        }

        // Return the user's messages
        return NextResponse.json(
            { success: true, messages: messages[0].messages, message: "Messages retrieved successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);

        // Return detailed error response
        return NextResponse.json(
            {
                error: "Internal server error",
                message: error.message || "An unknown error occurred",
            },
            { status: 500 }
        );
    }
}
