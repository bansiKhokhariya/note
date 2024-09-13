// 'use client';
// import { usePathname } from 'next/navigation';
// import Layout from '@/components/Layout';
// import MainContent from '@/components/MainContent';
// import { useState, useEffect } from 'react';

// export default function NotePage() {
//   const pathname = usePathname();

//   // Extract noteId from pathname by splitting the string
//   const noteId = pathname?.split('/').pop();

//   const [selectedNoteId, setSelectedNoteId] = useState(noteId);

//   useEffect(() => {
//     if (noteId && selectedNoteId !== noteId) {
//       setSelectedNoteId(noteId); // Update the selected note when the route changes
//     }
//   }, [noteId, selectedNoteId]);

//   return (
//     <Layout selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId}>
//       <MainContent noteId={selectedNoteId} />
//     </Layout>
//   );
// }

import { getSEOTags } from '@/libs/seo';
import Layout from '@/components/Layout';
import MainContent from '@/components/MainContent';

// Fetch note data server-side in the generateMetadata function
export async function generateMetadata({ params }) {
  const { id: noteId } = params;

  console.log(params.id);
  
  // Fetch note data
  const res = await fetch(`https://snowy.hksync.com/api/note/?noteUniqueId=${noteId}`);
  const noteData = await res.json();

  if (!noteData.success) {
    return {
      title: 'Note Not Found',
      description: 'The requested note does not exist',
    };
  }

  const title = noteData.notes.title || 'Untitled Note';


  console.log("title in generateMetadata",title);
  
  return getSEOTags({
    title,
    canonicalUrlRelative: `/${noteId}`,
  });
}

export default function NotePage({ params }) {
  const { id: noteId } = params;

  return (
    <Layout selectedNoteId={noteId}>
      <MainContent noteId={noteId} />
    </Layout>
  );
}


