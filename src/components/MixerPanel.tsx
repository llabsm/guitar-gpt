import { ChevronUp, ChevronDown } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore.ts';
import { getInstrumentType } from '../utils/formatTime.ts';
import InstrumentIcon from './InstrumentIcon.tsx';

export default function MixerPanel() {
  const { tracks, showMixer, toggleMixer, setTrackVolume, setTrackPan } =
    usePlayerStore();

  if (!showMixer || tracks.length === 0) {
    return (
      <div className="bg-[#16213e] border-t border-[#2a3a5c] px-4 py-1.5 shrink-0">
        <button
          onClick={toggleMixer}
          className="flex items-center gap-1 text-xs text-[#6677aa] hover:text-[#a0b0d0] transition-colors font-medium"
        >
          <ChevronUp size={12} />
          Show Mixer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] border-t border-[#2a3a5c] shrink-0">
      <div className="px-4 py-1.5 border-b border-[#2a3a5c]/50">
        <button
          onClick={toggleMixer}
          className="flex items-center gap-1 text-xs text-[#6677aa] hover:text-[#a0b0d0] transition-colors font-medium"
        >
          <ChevronDown size={12} />
          Hide Mixer
        </button>
      </div>
      <div className="p-3 flex gap-3 overflow-x-auto">
        {tracks.map((track) => (
          <div
            key={track.index}
            className="flex flex-col items-center gap-2 min-w-[90px] bg-[#1a1a2e] rounded-lg p-3 border border-[#2a3a5c]/50"
          >
            <span className="text-[#a0b0d0]">
              <InstrumentIcon type={getInstrumentType(track.instrument)} size={20} />
            </span>
            <span className="text-[11px] text-[#a0b0d0] truncate w-full text-center font-medium">
              {track.name}
            </span>

            {/* Volume */}
            <div className="flex flex-col items-center gap-1 w-full">
              <span className="text-[10px] text-[#6677aa] font-medium uppercase">Vol</span>
              <input
                type="range"
                min={0}
                max={100}
                value={track.volume}
                onChange={(e) => setTrackVolume(track.index, Number(e.target.value))}
                className="w-full h-1"
              />
              <span className="text-[10px] text-[#8899bb] font-mono tabular-nums">{track.volume}%</span>
            </div>

            {/* Pan */}
            <div className="flex flex-col items-center gap-1 w-full">
              <span className="text-[10px] text-[#6677aa] font-medium uppercase">Pan</span>
              <div className="flex items-center gap-1 w-full">
                <span className="text-[9px] text-[#6677aa]">L</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={track.pan}
                  onChange={(e) => setTrackPan(track.index, Number(e.target.value))}
                  className="flex-1 h-1"
                />
                <span className="text-[9px] text-[#6677aa]">R</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
