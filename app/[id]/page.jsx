// import { getSEOTags } from '@/libs/seo';
// import Layout from '@/components/Layout';
// import MainContent from '@/components/MainContent';

// // Fetch note data server-side and generate metadata (including OG tags)
// export async function generateMetadata({ params }) {
//   const { id: noteId } = params;
  
//   try {
//     // Fetch note data based on note ID
//     const res = await fetch(`https://note-nine-lime.vercel.app/api/note/?noteUniqueId=${noteId}`, {
//       next: { revalidate: 60 }, // Optionally cache the response for 60 seconds
//     });
//     const noteData = await res.json();

//     if (!noteData.success) {
//       // If note not found, set appropriate metadata
//       return {
//         title: 'Note Not Found',
//         openGraph: {
//           title: 'Note Not Found',
//           url: `https://note-nine-lime.vercel.app/${noteId}`,
//         },
//       };
//     }

//     // Extract the title and description from note data
//     const title = noteData.notes.title || 'Untitled Note';
//     const canonicalUrl = `https://note-nine-lime.vercel.app/${noteId}`;
    
//     // Return SEO tags, including OG tags
//     return getSEOTags({
//       title,
//       canonicalUrlRelative: `/${noteId}`,
//       openGraph: {
//         title,
//         url: canonicalUrl,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching note data:', error);

//     // Fallback metadata if API call fails
//     return {
//       title: 'Error Loading Note',
//       openGraph: {
//         title: 'Error Loading Note',
//         url: `https://note-nine-lime.vercel.app/${noteId}`,
//       },
//     };
//   }
// }

// // Page component
// export default function NotePage({ params }) {
//   const { id: noteId } = params;

//   return (
//     <Layout selectedNoteId={noteId}>
//       <MainContent noteId={noteId} />
//     </Layout>
//   );
// }


import { getSEOTags } from '@/libs/seo';
import Layout from '@/components/Layout';
import MainContent from '@/components/MainContent';

// Helper function to extract text from editor content JSON
function extractTextFromEditorContent(editorContent) {
  let extractedText = '';

  function traverseContent(content) {
    content.forEach(node => {
      if (node.type === 'text' && node.text) {
        extractedText += `${node.text} `;
      } else if (node.content) {
        traverseContent(node.content); // Recursively go deeper in the content tree
      }
    });
  }

  traverseContent(editorContent.content);
  
  // Trim and return the first 160 characters (or fewer)
  return extractedText.trim().substring(0, 160);
}
export async function generateMetadata({ params }) {
  const { id: noteId } = params;

  // Fetch note data
  const res = await fetch(`https://note-nine-lime.vercel.app/api/note/?noteUniqueId=${noteId}`);
  const noteData = await res.json();

  if (!noteData.success) {
    return {
      title: 'Note Not Found',
      description: 'The requested note does not exist',
    };
  }

  // Extract the title and description
  const title = noteData.notes.title || 'Untitled Note';
  const editorContent = noteData.notes.editor_content || { content: [] };

  // Extract the description from the editor content
  const description = extractTextFromEditorContent(editorContent) || 'A detailed note about various topics.';

  const canonicalUrl = `https://note-nine-lime.vercel.app/${noteId}`;
  
  // Static image URL for Open Graph preview
  const imageUrl = 'https://www.bluearcher.com/Files/BlogItems/Website-Design-Packages-What-You-Need-to-Know.png';

  // Return SEO tags, including OG tags and static image
  return getSEOTags({
    title,
    description, // Pass the extracted description
    canonicalUrlRelative: `/${noteId}`,
    openGraph: {
      title,
      description, // Pass the extracted description for OG tags as well
      url: canonicalUrl,
      // images: [imageUrl], // Static image for social media previews
    },
  });
}



// Page component
export default function NotePage({ params }) {
  const { id: noteId } = params;

  return (
    <Layout selectedNoteId={noteId}>
      <MainContent noteId={noteId} />
    </Layout>
  );
}
