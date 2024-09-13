import Note from './Note';
import NewNote from './NewNote';

export default function MainContent({ noteId }) {
  return (
    <div>
      {noteId ? (
        <Note noteId={noteId} />
      ) : (
        <NewNote/>
      )}
    </div>
  );
}
