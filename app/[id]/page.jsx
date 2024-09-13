import { getSEOTags } from '@/libs/seo';
import Layout from '@/components/Layout';
import MainContent from '@/components/MainContent';

// Fetch note data server-side and generate metadata (including OG tags)
export async function generateMetadata({ params }) {
  const { id: noteId } = params;
  
  try {
    // Fetch note data based on note ID
    const res = await fetch(`https://note-nine-lime.vercel.app/api/note/?noteUniqueId=${noteId}`, {
      next: { revalidate: 60 }, // Optionally cache the response for 60 seconds
    });
    const noteData = await res.json();

    if (!noteData.success) {
      // If note not found, set appropriate metadata
      return {
        title: 'Note Not Found',
        openGraph: {
          title: 'Note Not Found',
          url: `https://note-nine-lime.vercel.app/${noteId}`,
        },
      };
    }

    // Extract the title and description from note data
    const title = noteData.notes.title || 'Untitled Note';
    const canonicalUrl = `https://note-nine-lime.vercel.app/${noteId}`;
    
    // Return SEO tags, including OG tags
    return getSEOTags({
      title,
      canonicalUrlRelative: `/${noteId}`,
      openGraph: {
        title,
        url: canonicalUrl,
      },
    });
  } catch (error) {
    console.error('Error fetching note data:', error);

    // Fallback metadata if API call fails
    return {
      title: 'Error Loading Note',
      openGraph: {
        title: 'Error Loading Note',
        url: `https://note-nine-lime.vercel.app/${noteId}`,
      },
    };
  }
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
