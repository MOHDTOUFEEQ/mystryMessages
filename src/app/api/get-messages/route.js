import { NextResponse } from "next/server";
import UserModel from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

import { getDataFromToken } from '../../helpers/getDataFromToken'; 
await dbConnect()

export async function GET(request) {
    try {
        
        const tokenData = getDataFromToken(request);
        const  id  = tokenData;
        if (!id || !tokenData) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const userID = new mongoose.Types.ObjectId(id);
        if (!userID) {
            return NextResponse.json({error: "User ID not found"}, {status: 400});
        }
        // return NextResponse.json({userID: userID}, {status: 200});
        const messages = await UserModel.aggregate([
            {
                $match: {_id: userID}
            },
            {
                $unwind: "$messages"
            },
            { 
                $sort: { 'messages.createdAt': -1 } 
            },
            { 
                $group: { _id: '$_id', messages: { $push: '$messages' } } 
            },
        ]);
        
        if (!messages || messages.length === 0) {
            return NextResponse.json({success: true, message: "No messages found"}, {status: 200});
        }

        return NextResponse.json({messages: messages[0].messages, success: true, message:"message found"}, {status: 200});
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

