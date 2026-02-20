import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore.ts';

export default function Toast() {
  const { error, setError } = usePlayerStore();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!error) return;
    setExiting(false);

    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setError(null), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, setError]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`flex items-start gap-3 bg-red-900/90 border border-red-700 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm backdrop-blur-sm ${
          exiting ? 'toast-exit' : 'toast-enter'
        }`}
      >
        <AlertTriangle size={16} className="text-red-300 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium">Error</p>
          <p className="text-xs text-red-200 mt-0.5">{error}</p>
        </div>
        <button
          onClick={() => { setExiting(true); setTimeout(() => setError(null), 300); }}
          className="text-red-300 hover:text-white shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
