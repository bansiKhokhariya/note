'use client';
import Layout from '@/components/Layout';
import MainContent from '@/components/MainContent';
import { useState } from 'react';

export default function Home() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  return (
    <Layout selectedNoteId={selectedNoteId} onSelectNote={setSelectedNoteId}>
      <MainContent noteId={selectedNoteId} />
    </Layout>
  );
}

