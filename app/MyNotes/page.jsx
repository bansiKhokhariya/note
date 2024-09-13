'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash, Plus, Eye } from 'lucide-react';
import { useSession } from "next-auth/react";
import { Button } from '@/components/ui/button';
import Login from '@/components/magicLink/Login';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLoadNotes from '@/hooks/useLoadNotes';
import { formatDistanceToNow } from 'date-fns';

export default function MyNotes() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState('all');
  const router = useRouter();
  const { loadNotes, notes, loading, setNotes } = useLoadNotes(session, filter);

  useEffect(() => {
    localStorage.removeItem('isEditNote');
  }, []);

  useEffect(() => {
    loadNotes();
  }, [session, filter]);

  const handleEdit = (noteUniqueId) => {
    localStorage.setItem('isEditNote', 'true');
    router.push(`/${noteUniqueId}`);
  };

  const handleView = (noteUniqueId) => {
    router.push(`/${noteUniqueId}`);
  };

  const handleDelete = async (noteUniqueId) => {
    try {
      const response = await fetch(`/api/note?noteUniqueId=${noteUniqueId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        const updatedNotes = notes.filter(note => note.noteUniqueId !== noteUniqueId);
        setNotes(updatedNotes);
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleNewNote = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="container mx-auto">
      <div className='mx-0 sm:mx-20'>
        <div className="p-4">
          <div className='sticky top-0 bg-white z-50 pt-4 pb-2'>
            <div className='flex justify-between items-center mt-5 mb-5'>
              <div className='flex items-center gap-2'>
                <p className='text-lg sm:text-[30px]'><b>My Notes List</b></p>
              </div>
              <div className='flex gap-2'>
                <Button variant="outline" size="icon" onClick={handleNewNote}>
                  <Plus className="h-[1.2rem] w-[1.2rem]" />
                </Button>
                <Login />
              </div>
            </div>
            <div className='mb-5'>
              <label>Filter by Created At &nbsp;</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='px-10'>{filter}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("today")}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("yesterday")}>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("last7days")}>Last 7 Days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("thismonth")}>This Month</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ul className="space-y-4">
              {notes && notes.length > 0 ? (
                notes.map(note => (
                  <li key={note?.noteUniqueId} className="border p-4 mb-4 rounded shadow-md">
                    <h2 className="text-lg font-semibold">{note?.title || 'Untitled'}</h2>
                    <div className='flex justify-between gap-2 items-start flex-col sm:flex-row sm:items-center'>
                      <div className="mt-2 flex space-x-2">
                        <Pencil size={20} color='blue' className='cursor-pointer' onClick={() => handleEdit(note?.noteUniqueId)} />
                        <Trash size={20} color='red' className='cursor-pointer' onClick={() => handleDelete(note?.noteUniqueId)} />
                        <Eye size={20} color='blue' className='cursor-pointer' onClick={() => handleView(note?.noteUniqueId)} />
                      </div>
                      <p className="text-xs text-gray-500">
                        updated {formatDistanceToNow(new Date(note?.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <div className="text-center text-xl text-gray-500 mt-4">
                  No notes found
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}