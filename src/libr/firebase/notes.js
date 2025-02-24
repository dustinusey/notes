import { db } from "@/libr/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

// Create a new note
export const createNote = async (noteData) => {
  try {
    const docRef = await addDoc(collection(db, "notes"), {
      ...noteData,
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...noteData };
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, noteData) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await updateDoc(noteRef, {
      ...noteData,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

// Subscribe to user's notes
export const subscribeToNotes = (userId, callback) => {
  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const notes = [];
    snapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });
    callback(notes);
  });
};
