import { FolderOpen, ZoomIn, ZoomOut, Guitar } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore.ts';
import { useFileLoader } from '../hooks/useFileLoader.ts';

export default function TopBar() {
  const { zoomLevel, setZoomLevel, songTitle, songArtist, hasFile } = usePlayerStore();
  const { openFilePicker } = useFileLoader();

  return (
    <header className="flex items-center justify-between h-12 px-4 bg-[#16213e] border-b border-[#2a3a5c] shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Guitar size={20} className="text-[#e94560]" />
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-[#e94560]">Guitar</span>
            <span className="text-white">GPT</span>
          </h1>
        </div>
        {hasFile && (
          <span className="text-sm text-[#8899bb] truncate max-w-64">
            {songTitle} {songArtist !== 'Unknown Artist' && `\u2014 ${songArtist}`}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openFilePicker}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#0f3460] hover:bg-[#1a4a80] text-white rounded transition-colors font-medium"
        >
          <FolderOpen size={14} />
          Open File
        </button>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => setZoomLevel(zoomLevel - 0.1)}
            className="w-7 h-7 flex items-center justify-center text-[#8899bb] hover:text-white bg-[#1a1a2e] hover:bg-[#2a3a5c] rounded transition-colors"
            title="Zoom out (-)"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-[#8899bb] w-12 text-center font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(zoomLevel + 0.1)}
            className="w-7 h-7 flex items-center justify-center text-[#8899bb] hover:text-white bg-[#1a1a2e] hover:bg-[#2a3a5c] rounded transition-colors"
            title="Zoom in (+)"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
