"use client";

import DeleteNoteModal from "@/components/DeleteNoteModal";
import NoteCard from "@/components/NoteCard";
import { useAuth } from "@/context/AuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import {
  createNote,
  deleteNote,
  subscribeToNotes,
  updateNote,
} from "@/libr/firebase/notes";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi2";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [localNote, setLocalNote] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Subscribe to notes
    const unsubscribe = subscribeToNotes(user.uid, (updatedNotes) => {
      setNotes(updatedNotes);
    });

    return () => unsubscribe();
  }, [user, router]);

  // Update localNote when selectedNote changes
  useEffect(() => {
    setLocalNote(selectedNote);
  }, [selectedNote]);

  const debouncedUpdate = useDebounce(async (noteToUpdate) => {
    try {
      await updateNote(noteToUpdate.id, noteToUpdate);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }, 500); // 500ms delay

  const handleCreateNote = async () => {
    try {
      const newNote = {
        title: "Untitled",
        content: "",
        userImage: user.photoURL,
        createdAt: serverTimestamp(),
        userId: user.uid,
      };
      const createdNote = await createNote(newNote);
      setSelectedNote(createdNote);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleNoteChange = (changes) => {
    const updatedNote = { ...localNote, ...changes };
    setLocalNote(updatedNote); // Update local state immediately
    debouncedUpdate(updatedNote); // Debounce the server update
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNote(noteToDelete.id);
      if (selectedNote?.id === noteToDelete.id) {
        setSelectedNote(null);
        setLocalNote(null);
      }
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-secondary-50 dark:bg-secondary-800">
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="w-full max-w-[320px] border-r border-secondary-200 dark:border-secondary-700">
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
                Notes
              </h1>
              <button
                onClick={handleCreateNote}
                className="p-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white transition-all"
                aria-label="Create new note"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note.id} className="group relative">
                    <NoteCard
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onClick={setSelectedNote}
                    />
                    <button
                      onClick={() => {
                        setNoteToDelete(note);
                        setIsDeleteModalOpen(true);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Delete note"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-secondary-500 dark:text-secondary-400 text-center">
                    No notes yet. Click the + button to create one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-4">
          {localNote ? (
            <div className="space-y-4">
              <input
                type="text"
                value={localNote.title}
                onChange={(e) => handleNoteChange({ title: e.target.value })}
                className="w-full text-2xl font-semibold bg-transparent border-none outline-none text-secondary-900 dark:text-secondary-50 placeholder-secondary-400"
                placeholder="Untitled"
              />
              <textarea
                value={localNote.content}
                onChange={(e) => handleNoteChange({ content: e.target.value })}
                className="w-full h-[calc(100vh-200px)] bg-transparent border-none outline-none resize-none text-secondary-800 dark:text-secondary-200 placeholder-secondary-400"
                placeholder="Start writing..."
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-secondary-500 dark:text-secondary-400 text-center">
                Select a note to view or edit
              </p>
            </div>
          )}
        </div>
      </div>

      <DeleteNoteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
}
