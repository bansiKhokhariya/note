export const useUpdateNoteUserIds = (session) => {
    const updateNoteUserIds = async () => {
        if (session?.user) {
            const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
            if (noteIds.length > 0) {
                try {
                    const response = await fetch('/api/update-note-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ noteIds, userId: session.user.id }),
                    });

                    const result = await response.json();
                    if (response.ok && result.success) {
                        localStorage.removeItem('noteIds'); // Remove note IDs from localStorage
                    } else {
                        console.error('Failed to update note user IDs:', result.message);
                    }
                } catch (error) {
                    console.error('Error updating note user IDs:', error);
                }
            }
        }
    };
    updateNoteUserIds()
};
