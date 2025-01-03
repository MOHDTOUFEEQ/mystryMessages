import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const {username, verifyCode} = await request.json();
    const user = await UserModel.findOne({username : username });
    if (!user) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }
    if (user.verifyCode !== verifyCode) {
      return NextResponse.json({error: "Invalid verify code"}, {status: 400});
    }
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();;
    const isCodeValid = user.verifyCode === verifyCode;
    if (!isCodeNotExpired) {
      return NextResponse.json({error: "Verify code expired"}, {status: 400});
    }
    if (!isCodeValid) {
      return NextResponse.json({error: "Invalid verify code"}, {status: 400});
    }
    user.isVerified = true;
    await user.save();
    
    return Response.json(
      { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
  } catch (error) {
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}

