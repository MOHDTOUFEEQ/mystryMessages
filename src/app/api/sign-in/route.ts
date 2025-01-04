import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse the request body
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      // If either identifier or password is missing, return a 400 error response
      return NextResponse.json(
        { success: false, message: 'Identifier and password are required' },
        { status: 400 }
      );
    }

    console.log('Received credentials:', identifier, password);

    // Find the user by email or username
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No user found with this identifier' },
        { status: 404 }
      );
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
  }
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        if(token){
            console.log(token);
        }
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("auth-token", token)
    
      return response;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { success: false, message: 'Error during sign-in', error: "error.message" },
      { status: 500 }
    );
  }
}
