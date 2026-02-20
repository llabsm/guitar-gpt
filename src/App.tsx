import { useEffect, useCallback } from 'react';
import TopBar from './components/TopBar.tsx';
import FileDropZone from './components/FileDropZone.tsx';
import TrackSidebar from './components/TrackSidebar.tsx';
import TransportBar from './components/TransportBar.tsx';
import ScoreViewer from './components/ScoreViewer.tsx';
import MixerPanel from './components/MixerPanel.tsx';
import InfoBar from './components/InfoBar.tsx';
import Toast from './components/Toast.tsx';
import { usePlayerStore } from './stores/usePlayerStore.ts';
import { useFileLoader } from './hooks/useFileLoader.ts';

export default function App() {
  const { hasFile } = usePlayerStore();
  const { openFilePicker, loadFile } = useFileLoader();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const state = usePlayerStore.getState();
      const { api } = state;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          api?.playPause();
          break;
        case 'Escape':
          api?.stop();
          break;
        case 'ArrowRight': {
          e.preventDefault();
          const { currentBar, totalBars, goToBar } = state;
          if (currentBar < totalBars) {
            goToBar(currentBar); // currentBar is 1-based, goToBar expects 0-based index
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const { currentBar, goToBar: goTo } = state;
          if (currentBar > 1) {
            goTo(currentBar - 2); // currentBar is 1-based, go to previous (0-based)
          }
          break;
        }
        case 'Equal':
        case 'NumpadAdd':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const { zoomLevel, setZoomLevel } = usePlayerStore.getState();
            setZoomLevel(zoomLevel + 0.1);
          }
          break;
        case 'Minus':
        case 'NumpadSubtract':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const { zoomLevel, setZoomLevel } = usePlayerStore.getState();
            setZoomLevel(zoomLevel - 0.1);
          }
          break;
        case 'KeyO':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            openFilePicker();
          }
          break;
        case 'KeyL':
          if (!e.ctrlKey && !e.metaKey) {
            usePlayerStore.getState().toggleLoop();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openFilePicker]);

  // Global drag-and-drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  return (
    <div
      className="flex flex-col h-screen bg-[#1a1a2e] text-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <TopBar />

      <div className="flex flex-1 overflow-hidden relative">
        {hasFile && <TrackSidebar />}

        {/* ScoreViewer is always mounted so alphaTab API initializes immediately.
            Hidden visually when no file is loaded, but the container exists. */}
        <ScoreViewer hidden={!hasFile} />

        {/* FileDropZone overlays when no file is loaded */}
        {!hasFile && <FileDropZone />}
      </div>

      {hasFile && <TransportBar />}
      {hasFile && <MixerPanel />}
      <InfoBar />
      <Toast />
    </div>
  );
}
