'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Editor from "@/components/editor/advanced-editor";
import Navbar from '@/components/navbar';
import { useUpdateNoteUserIds } from '@/utils/useUpdateNoteUserIds';
import { defaultValue } from "@/app/default-value";
import { useRouter } from 'next/navigation'
import { useSession, signIn } from "next-auth/react";
import TaskModal from '@/components/dialog/TaskModal';
import GuestModal from '@/components/dialog/GuestModal';
import { getFormattedDateTime } from '@/utils/dateUtils';

export default function Note() {
    const { data: session } = useSession();

    // Initialize state with the current date and time
    const [title, setTitle] = useState();
    const [email, setEmail] = useState();
    const [value, setValue] = useState(defaultValue);
    const [noteUniqueId, setNoteUniqueId] = useState(null);
    const [theme, setTheme] = useState("light");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const router = useRouter();

    // Function to check for unsaved changes
    const hasUnsavedChanges = () => {
        return JSON.stringify(value) !== JSON.stringify(defaultValue);
    };

    // // Check for unsaved changes and show popup
    useEffect(() => {
        if (hasUnsavedChanges()) {
            localStorage.setItem('confirmPopup', true);
        } else {
            localStorage.setItem('confirmPopup', false);
        }
    }, [value]);

    useEffect(() => {
        if (session?.user?.email) {
            setEmail(session.user.email);
        }
    }, [session]);

    useEffect(() => {
        const now = new Date();
        setTitle(getFormattedDateTime(now));
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (title || value) { // Check if there is content to save
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

    const openTaskModal = () => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
        setIsTaskModalOpen(true);
    };

    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
    };

    const handlePublish = async () => {
        localStorage.setItem('confirmPopup', false);
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
        }
        try {
            // Save the note first
            const response = await fetch('/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    editor_content: value,
                    email: session?.user?.email,
                    noteUniqueId: noteUniqueId,
                }),
            });

            const data = await response.json();
            if (data.success) {
                // Update local storage with multiple note IDs
                if (!session?.user) {
                    // Retrieve the existing note IDs from local storage
                    let noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');

                    // Check if the note ID is already in the array
                    if (!noteIds.includes(data.note.noteUniqueId)) {
                        // If not, add the new unique note ID
                        noteIds.push(data.note.noteUniqueId);
                        localStorage.setItem('noteIds', JSON.stringify(noteIds));
                    }
                }
                setNoteUniqueId(data.note.noteUniqueId)
                // toast.success('Note published successfully!');
                setIsModalOpen(true);
            } else {
                toast.error('Failed to publish note');
            }
        } catch (error) {
            console.error('Error publishing note:', error);
            toast.error('An error occurred while publishing the note.');
        } finally {
        }
    };

    const handleCloseGuestModal = () => {
        setIsModalOpen(false);
        setEmail('')
        router.push(`/${noteUniqueId}`);
    }

    const handleSignIn = async () => {
        try {
            await signIn('email', { email, callbackUrl: `/${noteUniqueId}` });
        } catch (error) {
            console.error('Error signing in', error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: `/${noteUniqueId}` });
        } catch (error) {
            console.error('Error signing in with Google', error);
        }
    };

    const handleGuestModal = async () => {
        try {
            await handlePublish();
            if (session?.user) {
                router.push(`/${noteUniqueId}`);
            } else {
                if (email && !session?.user) {
                    await handleSignIn();
                    router.push(`/${noteUniqueId}`);
                } else {
                    router.push(`/${noteUniqueId}`);
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    const handleSubmit = async ({ topicName, keywords, strategy }) => {
        setTitle(topicName);
        setEditorKey(true)
        try {
            const response = await fetch('/api/generate-task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topicName, keywords, strategy }),
            });

            const data = await response.json();

            if (data.success) {
                // Create content for topicName
                const topicContent = {
                    type: "paragraph",
                    content: [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ],
                            "text": "Topic Name: "
                        },
                        {
                            "type": "text",
                            text: `${data.topicName}`
                        }
                    ]
                };

                // Create content for keywords
                const keywordsArray = data.keywords.split(',').map(keyword => keyword.trim());
                const keywordsContent = {
                    type: "paragraph",
                    content: [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ],
                            "text": "Keywords: "
                        },
                        {
                            "type": "text",
                            text: `\n${keywordsArray.join('\n')}`
                        }
                    ]
                };

                // Convert the generated URLs and titles into separate ProseMirror JSON structures

                const URL = {
                    type: "paragraph",
                    content: [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ],
                            "text": "Domain Names: "
                        },
                    ]
                };

                const domainNamesContent = data.domainNames.map(url => ({
                    type: "paragraph",
                    content: [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "link",
                                    "attrs": {
                                        "href": `https://${url}`,
                                        "target": "_blank",
                                        "rel": "noopener noreferrer nofollow",
                                        "class": "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
                                    }
                                }
                            ],
                            "text": `${url}`
                        }
                    ]
                }));

                const CfTitle = {
                    type: "paragraph",
                    content: [
                        {
                            "type": "text",
                            "marks": [
                                {
                                    "type": "bold"
                                }
                            ],
                            "text": "CF NAME: "
                        },
                    ]
                };

                const cfTitlesContent = data.cfNames.map(title => ({
                    type: "paragraph",
                    content: [
                        {
                            type: "text",
                            text: `${title}`
                        }
                    ]
                }));

                // Combine all the contents together
                // Filter out any empty or null content blocks from value.content
                const filteredContent = value?.content?.filter(block => {
                    return (
                        block?.content?.length > 0 &&
                        block.content[0]?.text?.trim() !== ""
                    );
                });

                // Update the value with the new content structure
                const updatedValue = {
                    ...value,
                    content: [
                        ...filteredContent,
                        topicContent,
                        keywordsContent,
                        URL,
                        ...domainNamesContent,
                        CfTitle,
                        ...cfTitlesContent,
                    ],
                };

                setValue(updatedValue);
                setEditorKey(true);
            } else {
                console.error('Failed to generate task');
            }
        } catch (error) {
            console.error('Error generating task:', error);
        }
    };

    const handleEditorChange = (newValue) => {
        setValue(newValue);
        setEditorKey(false); // Reset key state to false when value changes
    };

    useEffect(() => {
        useUpdateNoteUserIds(session);
    }, [session?.user]);

    return (
        <div className="flex-grow w-full px-4 h-screen overflow-auto">
            <div className='sticky bansi z-10 top-0'>
                <Navbar handlePublish={handlePublish} openTaskModal={openTaskModal} />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bansi p-2 mb-4 focus:outline-none font-bold focus:border-blue-500 rounded text-[20px] sm:text-[25px]"
                    placeholder="Enter title"
                />
            </div>
            <div>
                <div>
                    <Editor
                        initialValue={value}
                        onChange={(updatedValue) => {
                            setValue(updatedValue);
                        }}
                    />
                </div>
            </div>
            <TaskModal isOpen={isTaskModalOpen} theme={theme} onClose={closeTaskModal} onSubmit={handleSubmit} />
            <GuestModal title={title} setTitle={setTitle} email={email} setEmail={setEmail} noteUniqueId={noteUniqueId} isOpen={isModalOpen} theme={theme} onClose={handleCloseGuestModal} onSubmit={handleGuestModal} handleGoogleSignIn={handleGoogleSignIn} />
        </div>
    );
}
