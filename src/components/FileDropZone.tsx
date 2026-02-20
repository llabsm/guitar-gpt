import { useState, useCallback } from 'react';
import { Guitar, Upload } from 'lucide-react';
import { useFileLoader } from '../hooks/useFileLoader.ts';

const SUPPORTED_EXTENSIONS = ['.gp3', '.gp4', '.gp5', '.gpx', '.gp'];

export default function FileDropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const { loadFile, openFilePicker } = useFileLoader();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-8 z-10"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`w-full max-w-lg p-12 rounded-2xl border-2 border-dashed transition-all duration-200 text-center cursor-pointer ${
          isDragging
            ? 'border-[#e94560] bg-[#e94560]/10 scale-105'
            : 'border-[#2a3a5c] bg-[#16213e]/60 hover:border-[#e94560]/50 hover:bg-[#16213e]/80'
        }`}
        onClick={openFilePicker}
      >
        <div className="flex justify-center mb-6">
          {isDragging ? (
            <Upload size={56} className="text-[#e94560]" />
          ) : (
            <Guitar size={56} className="text-[#8899bb]" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Drop a tablature file here
        </h2>
        <p className="text-[#8899bb] mb-6">
          or click to browse your files
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUPPORTED_EXTENSIONS.map((ext) => (
            <span
              key={ext}
              className="px-3 py-1 text-xs bg-[#0f3460] text-[#a0b0d0] rounded-full font-mono"
            >
              {ext}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
