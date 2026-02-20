import { usePlayerStore } from '../stores/usePlayerStore.ts';
import { getInstrumentType } from '../utils/formatTime.ts';
import InstrumentIcon from './InstrumentIcon.tsx';

export default function TrackSidebar() {
  const {
    tracks,
    selectedTrackIndices,
    selectTrack,
    toggleMute,
    toggleSolo,
  } = usePlayerStore();

  if (tracks.length === 0) return null;

  return (
    <aside className="w-56 max-md:w-12 bg-[#16213e] border-r border-[#2a3a5c] overflow-y-auto shrink-0 transition-all">
      <div className="p-2 max-md:p-1">
        <h3 className="text-[11px] font-semibold text-[#6677aa] uppercase tracking-wider px-2 mb-2 max-md:hidden">
          Tracks
        </h3>
        <div className="space-y-1">
          {tracks.map((track) => {
            const isSelected = selectedTrackIndices.includes(track.index);
            const instrumentType = getInstrumentType(track.instrument);
            return (
              <div
                key={track.index}
                className={`flex items-center gap-2 px-2 py-2 max-md:px-0.5 max-md:py-1.5 max-md:justify-center rounded cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#0f3460]/80'
                    : 'hover:bg-[#1e2a47]'
                }`}
                onClick={(e) => selectTrack(track.index, e.ctrlKey || e.metaKey)}
                title={track.name}
              >
                <div
                  className="w-1.5 h-8 max-md:h-6 rounded-full shrink-0"
                  style={{ backgroundColor: track.color }}
                />
                <span className="shrink-0 text-[#a0b0d0]">
                  <InstrumentIcon type={instrumentType} size={16} />
                </span>
                <span className={`text-sm truncate flex-1 max-md:hidden ${
                  isSelected ? 'text-white font-medium' : 'text-[#a0b0d0]'
                }`}>
                  {track.name}
                </span>
                <div className="flex gap-1 shrink-0 max-md:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSolo(track.index);
                    }}
                    className={`w-6 h-6 text-[11px] font-bold rounded transition-colors ${
                      track.isSolo
                        ? 'bg-[#e94560] text-white'
                        : 'bg-[#1a1a2e] text-[#6677aa] hover:text-[#a0b0d0] hover:bg-[#2a3a5c]'
                    }`}
                    title="Solo"
                  >
                    S
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(track.index);
                    }}
                    className={`w-6 h-6 text-[11px] font-bold rounded transition-colors ${
                      track.isMuted
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#1a1a2e] text-[#6677aa] hover:text-[#a0b0d0] hover:bg-[#2a3a5c]'
                    }`}
                    title="Mute"
                  >
                    M
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
