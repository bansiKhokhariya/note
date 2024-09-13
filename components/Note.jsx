'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Editor from "@/components/editor/advanced-editor";
import { generateHTML } from '@tiptap/html';
import { defaultExtensions } from '@/components/editor/extensions';
import Navbar from '@/components/navbar';
import { useUpdateNoteUserIds } from '@/utils/useUpdateNoteUserIds';
import { useSession } from "next-auth/react";
import { getSEOTags } from "@/libs/seo";
import Head from "next/head";

export default function Note({ noteId }) {
  const { data: session } = useSession();
  const [value, setValue] = useState(null);
  const [initialValue, setInitialValue] = useState(null); // Store initial value
  const [title, setTitle] = useState('');
  const [initialTitle, setInitialTitle] = useState(''); // Store initial title
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [contentHtml, setContentHtml] = useState('');

  useEffect(() => {
    const isEditNote = localStorage.getItem('isEditNote');
    if (isEditNote === 'true') {
      setIsEditMode(true);
    }
  }, []);

  useEffect(() => {
    useUpdateNoteUserIds(session);
  }, [session?.user]);

  useEffect(() => {
    const fetchNote = async () => {
      if (noteId) {
        try {
          const response = await fetch(`/api/note/?noteUniqueId=${noteId}`);
          const data = await response.json();
          if (data.success) {
            const fetchedTitle = data.notes.title || '';
            const fetchedValue = data.notes.editor_content || null;
            const html = generateHTML(fetchedValue, defaultExtensions);

            setTitle(fetchedTitle);
            setInitialTitle(fetchedTitle); // Set initial title
            setContentHtml(html);
            setValue(fetchedValue);
            setInitialValue(fetchedValue); // Set initial value
          } else {
            toast.error('Failed to load note');
          }
        } catch (error) {
          console.error('Error fetching note:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchNote();
  }, [noteId]);

  const handleUpdate = async () => {
    localStorage.setItem('confirmPopup', false);
    try {
      const response = await fetch('/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteUniqueId: noteId,
          title: title,
          editor_content: value,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error('Failed to update note');
      } else {
        toast.success('Note Updated successfully!');
        setInitialTitle(title); // Update initial title after save
        setTitle(title); // Update initial title after save
        setInitialValue(value); // Update initial value after save
        setValue(value); // Update initial value after save
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('An error occurred while updating the note.');
    }
  };

  const toggleEditMode = () => {
    localStorage.removeItem('isEditNote');
    const html = generateHTML(value, defaultExtensions);
    setContentHtml(html);
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    document.title = title;
  }, [title]);

  // Check for unsaved changes only if the title or value has been modified
  const hasUnsavedChanges = title !== initialTitle || value !== initialValue;

  useEffect(() => {
    if (hasUnsavedChanges) {
      localStorage.setItem('confirmPopup', true);
    } else {
      localStorage.setItem('confirmPopup', false);
    }
  }, [title, value, initialTitle, initialValue]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (title !== initialTitle || value !== initialValue) { // Check if there is content to save
        const confirmationMessage = 'You have unsaved changes. Do you really want to leave?';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [title, value]);

  return (
    <>
      <div className="flex-grow w-full px-4 h-screen overflow-auto">
        <div className='sticky bansi z-10 top-0'>
          <Navbar isEditMode={isEditMode} toggleEditMode={toggleEditMode} saveChanges={handleUpdate} />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full p-2 bansi focus:outline-none font-bold focus:border-blue-500 rounded text-[20px] sm:text-[25px]"
            disabled={!isEditMode}
          />
        </div>
        <div className="mt-2">
          {loading ? (
            <div className="flex justify-center items-center ">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="">
              <div>
                {isEditMode ? (
                  <Editor
                    initialValue={value}
                    onChange={(updatedValue) => {
                      setValue(updatedValue);
                    }}
                  />
                ) : (
                  <div className='ProseMirror prose prose-lg dark:prose-invert max-w-full' dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


