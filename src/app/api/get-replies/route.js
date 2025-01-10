import { NextResponse } from "next/server";
import UserModel from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getDataFromToken } from '../../helpers/getDataFromToken'; 

await dbConnect();

export async function GET(request) {
    try {
        const tokenData = getDataFromToken(request);
        const id = tokenData;
        if (!id || !tokenData) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        
        const userID = new mongoose.Types.ObjectId(id);
        if (!userID) {
            return NextResponse.json({error: "User ID not found"}, {status: 400});
        }

        const messages = await UserModel.aggregate([
            {
                $match: {_id: userID} // Match the user by ID
            },
            {
                $unwind: "$messages" // Unwind the messages array
            },
            { 
                $match: { "messages.status": true } // Filter only messages where status is true
            },
            { 
                $sort: { 'messages.createdAt': -1 } // Sort by message creation date (most recent first)
            },
            {
                $project: { // Include the fields we want in the result
                    content: "$messages.content",
                    reply: "$messages.reply",
                    status: "$messages.status",
                    createdAt: "$messages.createdAt"
                }
            },
            { 
                $group: { // Group messages back together by user ID
                    _id: '$_id', 
                    messages: { $push: '$$ROOT' } 
                }
            }
        ]);

        if (!messages || messages.length === 0 || messages[0].messages.length === 0) {
            return NextResponse.json({success: true, message: "No messages found"}, {status: 200});
        }

        // Return only the messages with the status set to true
        return NextResponse.json({messages: messages[0].messages, success: true, message: "Messages found"}, {status: 200});
    } catch (error) {
        console.error("Error: ", error); // Log the error for debugging
        
        return NextResponse.json(
            {
                error: "Internal server error",
                message: error instanceof Error ? error.message : "An unknown error occurred",
            },
            { status: 500 }
        );
    }
}
