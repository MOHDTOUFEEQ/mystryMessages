import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import mongoose from "mongoose";

await dbConnect()

export async function GET(request: NextRequest) {
    try {
        
        const session = await getServerSession(authOptions);
        // return NextResponse.json({session: session}, {status: 200});
        const user: User = session?.user as User;
        if (!session || !session.user) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const userID = new mongoose.Types.ObjectId(user._id);
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
            return NextResponse.json({error: "No messages found",success: false, message: "No messages found"}, {status: 404});
        }

        return NextResponse.json({messages: messages[0].messages, success: true}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

