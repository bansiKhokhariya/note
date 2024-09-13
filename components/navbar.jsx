'use client';
import { useEffect, useState } from 'react'
import { Save, BadgePlus, Eye, Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from "@/components/theme-toggle";
import Login from '@/components/magicLink/Login';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast

const Navbar = ({ handlePublish, openTaskModal, toggleEditMode, isEditMode, saveChanges }) => {
    const { data: session, status } = useSession();
    const [isEditable, setIsEditable] = useState(false);
    const [noteId, setNoteId] = useState(null);
    const [loading, setLoading] = useState(true);

    const pathname = usePathname();
    const handleNewNote = () => {
        window.open('/', '_blank');
    };

    const currentRoute = usePathname()
    // Extract the noteId from the URL if it's part of the route
    useEffect(() => {
        const pathSegments = pathname.split('/');
        const currentNoteId = pathSegments[pathSegments.length - 1];
        setNoteId(currentNoteId); // Set noteId from the URL
    }, [pathname]);

    // Fetch note data and compare userId with session userId
    useEffect(() => {
        const fetchNote = async () => {
            if (noteId && status === "authenticated") {
                try {
                    const response = await fetch(`/api/note/?noteUniqueId=${noteId}`);
                    const data = await response.json();
                    if (data.success) {
                        const fetchedUserId = data.notes.user || '';
                        // Compare fetched userId with session userId
                        if (fetchedUserId === session.user.id) {
                            setIsEditable(true); // Show edit button if IDs match
                        } else {
                            setIsEditable(false); // Hide edit button if IDs don't match
                        }
                    } else {
                        toast.error('Failed to load note');
                    }
                } catch (error) {
                    console.error('Error fetching note:', error);
                    toast.error('Error fetching note');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (status === 'authenticated') {
            fetchNote();
        }
    }, [noteId, status, session]);

    return (
        <>
            <div className="flex w-full justify-between items-center gap-1 pt-2">
                <div className="flex items-center gap-2 ">
                    {currentRoute === '/' ? (
                        <>
                            <div onClick={handlePublish}>
                                <Button className="md:block hidden px-10">Save</Button>
                                <div className='md:hidden block'>
                                    <Button variant="outline" size="icon">
                                        <Save className="h-[1.2rem] w-[1.2rem]" aria-label="Save" />
                                    </Button>
                                </div>
                            </div>
                            <div onClick={openTaskModal}>
                                <Button className="md:block hidden px-10">Generate Task</Button>
                                <div className='md:hidden block'>
                                    <Button variant="outline" size="icon">
                                        <BadgePlus className="h-[1.2rem] w-[1.2rem]" aria-label="BadgePlus" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {isEditable && <>
                                {isEditMode ? (
                                    <>
                                        <Button size="icon">
                                            <Eye
                                                size={20}
                                                className='cursor-pointer h-[1.2rem] w-[1.2rem]'
                                                onClick={toggleEditMode}
                                                aria-label="eye"
                                            />
                                        </Button>
                                        <div onClick={saveChanges}>
                                            <Button className="md:block hidden px-10">Save</Button>
                                            <div className='md:hidden block'>
                                                <Button variant="outline" size="icon">
                                                    <Save className="h-[1.2rem] w-[1.2rem]" aria-label="save" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Button size="icon">
                                        <Pencil
                                            size={20}
                                            className='cursor-pointer h-[1.2rem] w-[1.2rem]'
                                            onClick={toggleEditMode}
                                            aria-label="pencil"
                                        />
                                    </Button>
                                )}
                            </>}
                            <div onClick={handleNewNote}>
                                <Button className="md:block hidden px-10">New Note</Button>
                                <div className='md:hidden block'>
                                    <Button variant="outline" size="icon">
                                        <Plus className="h-[1.2rem] w-[1.2rem]" aria-label="plus" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <ThemeToggle />
                    <Login />
                </div>
            </div>
        </>
    );
};

export default Navbar;

