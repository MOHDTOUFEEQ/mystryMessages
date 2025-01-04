import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import { getDataFromToken } from '../../helpers/getDataFromToken'; 
import { NextResponse } from 'next/server';


export async function POST(request) {
  // Connect to the database
  await dbConnect();

   const tokenData = getDataFromToken(request);
    const  id  = tokenData;
  
    if (!id || !tokenData) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = id;
  const { acceptMessages } = await request.json();

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  // Connect to the database
  await dbConnect();
  // Get the user session
  const tokenData = getDataFromToken(request);
  const  id  = tokenData;
  
  // Check if the user is authenticated
  if (!id || !tokenData) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(id);
    
    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}