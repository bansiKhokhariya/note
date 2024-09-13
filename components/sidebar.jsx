import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import useLoadNotes from '@/hooks/useLoadNotes';
import { confirmUnsavedChanges } from '@/utils/confirmUnsavedChanges';
import { Button } from '@/components/ui/button';
import { Trash, Menu } from 'lucide-react';
import toast from "react-hot-toast";


const Sidebar = ({ onSelectNote }) => {
  const { data: session } = useSession();
  const { loadNotes, notes, loading, setNotes } = useLoadNotes(session);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const handleView = async (noteUniqueId) => {
    const confirmPopupValue = localStorage.getItem('confirmPopup');

    if (confirmPopupValue == 'true') {
      const userChoice = await confirmUnsavedChanges();
      if (userChoice === 'ok') {
        router.push(`/${noteUniqueId}`, undefined, { shallow: true });
        onSelectNote && onSelectNote(noteUniqueId);
      } else if (userChoice === 'cancel') {
        return;
      }
    } else {
      router.push(`/${noteUniqueId}`, undefined, { shallow: true });
      onSelectNote && onSelectNote(noteUniqueId);
    }

    localStorage.setItem('confirmPopup', 'false');
    setSidebarOpen(false);
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
        toast.success('Note Delete successfully!');
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="lg:hidden rounded ml-4 ">
        <Button size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" onClick={handleToggleSidebar} aria-label="menu" />
        </Button>
      </div>
      <div className={`fixed w-64 h-screen inset-0 bansi border bg-opacity-75 z-50 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform lg:relative lg:translate-x-0 lg:bg-transparent lg:opacity-100`}>
        <div className="w-64 h-screen bansi p-4 border overflow-y-auto lg:sticky lg:top-0">
          <button onClick={handleToggleSidebar} className="absolute top-4 right-4 lg:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h2 className="text-lg font-bold mb-4">Notes</h2>
          {loading ? (
            <p>Loading...</p>
          ) : notes && notes.length > 0 ? (
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  key={note?.noteUniqueId}
                  className="p-2 border rounded cursor-pointer relative flex items-center justify-between"
                >
                  <span
                    onClick={() => handleView(note?.noteUniqueId)}
                    className="block cursor-pointer"
                  >
                    {note?.title || 'Untitled'}
                  </span>
                  <Trash
                    size={20}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => handleDelete(note?.noteUniqueId)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No notes available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
