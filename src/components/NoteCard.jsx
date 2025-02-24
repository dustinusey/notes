"use client";

import { formatDistanceToNow } from "date-fns";

const NoteCard = ({ note, isSelected, onClick }) => {
  // Convert Firestore timestamp to Date object
  const createdAtDate = note.createdAt?.toDate?.() || new Date(note.createdAt);

  return (
    <button
      onClick={() => onClick(note)}
      className={`w-full text-left p-3 rounded-xl transition-all ${
        isSelected
          ? "bg-secondary-200 dark:bg-secondary-700"
          : "hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
      }`}
    >
      <div className="flex gap-3">
        <img
          src={note.userImage}
          alt="Profile"
          className="w-8 h-8 rounded-full shrink-0"
        />
        <div className="min-w-0 space-y-1">
          <h3 className="font-medium text-secondary-900 dark:text-secondary-50 truncate">
            {note.title || "Untitled"}
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-300 truncate">
            {note.content || "No content"}
          </p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            {formatDistanceToNow(createdAtDate, { addSuffix: true })}
          </p>
        </div>
      </div>
    </button>
  );
};

export default NoteCard;
