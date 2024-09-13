import connectMongo from '@/libs/mongoose';
import Note from '@/models/NoteSchema';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    await connectMongo();
    try {
        const body = await req.json();
        const { noteIds, userId } = body;

        // Update all notes with the specified noteIds
        const updatedNotes = await Note.updateMany(
            { noteUniqueId: { $in: noteIds } },
            { user: userId },
            { new: true, runValidators: true }
        );

        if (updatedNotes.matchedCount === 0) {
            return NextResponse.json({ success: false, error: 'No notes found with the provided IDs' }, { status: 404 });
        }

        return NextResponse.json({ success: true, notes: updatedNotes });
    } catch (error) {
        console.error('Error updating notes:', error);
        return NextResponse.json({ success: false, error: 'Failed to update notes' }, { status: 500 });
    }
}

