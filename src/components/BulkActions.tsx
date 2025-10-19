import { CheckCheck, Trash2 } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onCompleteSelected: () => void;
  onDeleteSelected: () => void;
}

export function BulkActions({ selectedCount, onCompleteSelected, onDeleteSelected }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-2xl px-6 py-4 flex items-center gap-6 z-50 animate-slide-up">
      <span className="font-semibold">
        {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex gap-3">
        <button
          onClick={onCompleteSelected}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <CheckCheck size={18} />
          Mark Complete
        </button>
        
        <button
          onClick={onDeleteSelected}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}
