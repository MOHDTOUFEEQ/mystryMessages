import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/Users';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
    const { messageid } = params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(!session || !user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await dbConnect();
    try {
        await UserModel.findByIdAndUpdate(user._id, { $pull: { messages: { _id: messageid } } });
        return NextResponse.json({ message: 'Message deleted successfully' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ message: 'Failed to delete message', error: error  }, { status: 500 });
    }
}