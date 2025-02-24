const DeleteNoteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">
          Delete Note
        </h2>
        <p className="text-secondary-600 dark:text-secondary-300">
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-secondary-50 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNoteModal;
