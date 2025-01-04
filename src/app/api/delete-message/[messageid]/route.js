import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import { NextResponse } from 'next/server';
import { getDataFromToken } from '../../../helpers/getDataFromToken'; 

export async function DELETE(request, { params }) {
    const { messageid } = params;

    const tokenData = getDataFromToken(request);
    const  id  = tokenData;
    if(!id || !tokenData) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    try {
        await UserModel.findByIdAndUpdate(id, { $pull: { messages: { _id: messageid } } });
        return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ message: 'Failed to delete message', error: error  }, { status: 500 });
    }
}