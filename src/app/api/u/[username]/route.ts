import UserModel, { Message } from "@/model/Users";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, { params }: { params: { username: string } }) {
    try {
        await dbConnect();
        const { username } = params;
        const { message } = await request.json();
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }
        const user = await UserModel.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (user.isAcceptingMessages === false) {
            return NextResponse.json({ error: "User is not accepting messages", success: false }, { status: 400 });
        }
        const messagee = { content: message, createdAt: new Date() } as Message;
        user.messages.push(messagee);
        await user.save();
        return NextResponse.json({ message: "User updated successfully", success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
