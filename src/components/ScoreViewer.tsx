import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useAlphaTab } from '../hooks/useAlphaTab.ts';
import { usePlayerStore } from '../stores/usePlayerStore.ts';

interface Props {
  hidden?: boolean;
}

export default function ScoreViewer({ hidden }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAlphaTab(containerRef);

  const { isRendering, soundFontProgress, isPlayerReady, hasFile } = usePlayerStore();

  const showSoundFontBar = hasFile && soundFontProgress < 1;
  const showRendering = hasFile && isRendering;
  const showWaiting = hasFile && !isPlayerReady && !isRendering && soundFontProgress >= 1;

  return (
    <div
      className={`flex-1 relative overflow-hidden bg-[#1a1a2e] ${hidden ? 'invisible absolute inset-0' : ''}`}
    >
      {/* SoundFont loading progress */}
      {showSoundFontBar && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-[#16213e] px-4 py-2 border-b border-[#2a3a5c]">
          <div className="flex items-center gap-3">
            <Loader2 size={14} className="text-[#e94560] animate-spin shrink-0" />
            <span className="text-xs text-[#8899bb]">Loading SoundFont...</span>
            <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e94560] transition-all duration-300 rounded-full"
                style={{ width: `${Math.max(soundFontProgress * 100, 2)}%` }}
              />
            </div>
            <span className="text-xs text-[#a0b0d0] font-mono tabular-nums w-10 text-right">
              {Math.round(soundFontProgress * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Rendering spinner */}
      {showRendering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1a1a2e]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="text-[#e94560] animate-spin" />
            <span className="text-sm text-[#a0b0d0]">Rendering score...</span>
          </div>
        </div>
      )}

      {/* Waiting for player */}
      {showWaiting && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1a1a2e]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="text-[#0f3460] animate-spin" />
            <span className="text-sm text-[#a0b0d0]">Initializing player...</span>
          </div>
        </div>
      )}

      {/* alphaTab container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto at-main"
      />
    </div>
  );
}
