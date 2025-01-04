import { NextResponse } from 'next/server';
import { getDataFromToken } from '../../helpers/getDataFromToken'; 
import dbConnect from '@/lib/dbConnect';
import UserModel from "../../../model/Users"


export async function GET(request) {
  // Decode the token and get user ID
  const tokenData = getDataFromToken(request);
  const  id  = tokenData;

  // If there's an error or no token data, return an error response
  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error }, { status: 401 });
  }


  try {
    await dbConnect()
  
    const user = await UserModel.findOne({ _id: id }).select("-password");
    
    if (user) {
      return NextResponse.json({ user: user }, { status: 200 });

    }
    if (!user) {
      // If no user found, return an error response
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data (excluding sensitive data)
    // const userData = {
    //   id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   // Add any other fields you want to return from the database
    // };

    return NextResponse.json({ user: user }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
