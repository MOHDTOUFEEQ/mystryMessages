import { NextRequest, NextResponse } from "next/server";
import UserModel, { Message } from "@/model/Users";
import dbConnect from "@/lib/dbConnect";


export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const {username, message} = await request.json();
        if (!username || !message) {
            return NextResponse.json({error: "Invalid request"}, {status: 400});
        }
        const user = await UserModel.findOne({username});
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        // const messagee = {content: message, createdAt: new Date()};
        user.messages.push(messagee as Message);
        await user.save();
        return NextResponse.json({message: "Message sent successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

