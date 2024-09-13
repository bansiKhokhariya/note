// import { useState } from 'react';
// import { startOfToday, startOfYesterday, subDays, startOfMonth } from 'date-fns';

// const useLoadNotes = (session, filter) => {
//   const [loading, setLoading] = useState(false);
//   const [notes, setNotes] = useState([]);

//   const loadNotes = async () => {
//     setLoading(true);
//     let notesList = [];

//     if (session?.user) {
//       const url = `/api/note?noteUniqueId=null&email=${session.user.email}`;
//       notesList = await fetchNotes(url);
//     } else {
//       const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
//       const uniqueNoteIds = [...new Set(noteIds)];
//       const responses = await Promise.all(
//         uniqueNoteIds.map((id) => fetchNotes(`/api/note?noteUniqueId=${id}`))
//       );
//       notesList = responses.filter((note) => note !== null);
//     }

//     // Deduplicate notes
//     const uniqueNotes = Array.from(new Map(notesList?.map(note => [note.noteUniqueId, note])).values());

//     // Sort notes by updatedAt in descending order to show the latest first
//     uniqueNotes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

//     // Apply filter to the notes
//     const filteredNotes = applyFilter(uniqueNotes, filter);
//     setNotes(filteredNotes);
//     setLoading(false);
//   };

//   const fetchNotes = async (url) => {
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.success) {
//         return data?.notes;
//       } else {
//         console.error('Failed to fetch note:', data.error);
//       }
//     } catch (error) {
//       console.error('Error fetching note:', error);
//     }
//     return null;
//   };

//   const applyFilter = (notes, filter) => {
//     const now = new Date();
//     switch (filter) {
//       case 'today':
//         return notes.filter(note => new Date(note.createdAt) >= startOfToday());
//       case 'yesterday':
//         return notes.filter(note => {
//           const createdAt = new Date(note.createdAt);
//           return createdAt >= startOfYesterday() && createdAt < startOfToday();
//         });
//       case 'last7days':
//         return notes.filter(note => new Date(note.createdAt) >= subDays(now, 7));
//       case 'thismonth':
//         return notes.filter(note => new Date(note.createdAt) >= startOfMonth(now));
//       default:
//         return notes;
//     }
//   };

//   return { loadNotes, notes, loading, setNotes }; // Expose setNotes
// };

// export default useLoadNotes;

import { useState } from 'react';

const useLoadNotes = (session) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    setLoading(true);
    let notesList = [];

    if (session?.user) {
      // Fetch notes for the logged-in user
      const url = `/api/note?noteUniqueId=null&email=${session.user.email}`;
      notesList = await fetchNotes(url);
    } else {
      // Fetch notes stored in localStorage for anonymous users
      const noteIds = JSON.parse(localStorage.getItem('noteIds') || '[]');
      const uniqueNoteIds = [...new Set(noteIds)];
      const responses = await Promise.all(
        uniqueNoteIds.map((id) => fetchNotes(`/api/note?noteUniqueId=${id}`))
      );
      notesList = responses.filter((note) => note !== null);
    }

    // Ensure notesList is always an array
    const sortedNotesList = (notesList || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setNotes(notesList);
    setLoading(false);
  };

  const fetchNotes = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        return data?.notes;
      } else {
        console.error('Failed to fetch note:', data.error);
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    }
    return null;
  };

  return { loadNotes, notes, loading, setNotes }; // Expose setNotes for external manipulation if needed
};

export default useLoadNotes;
