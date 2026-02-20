import { usePlayerStore } from '../stores/usePlayerStore.ts';

export default function InfoBar() {
  const {
    currentBar,
    totalBars,
    timeSignature,
    keySignature,
    songTitle,
    songArtist,
    hasFile,
  } = usePlayerStore();

  if (!hasFile) return null;

  return (
    <div className="flex items-center justify-between h-6 px-4 bg-[#0f3460]/30 text-[11px] text-[#6677aa] shrink-0 border-t border-[#2a3a5c]/30">
      <span>
        {songTitle} {songArtist !== 'Unknown Artist' && `\u2014 ${songArtist}`}
      </span>
      <div className="flex items-center gap-4 font-mono tabular-nums">
        <span>Bar {currentBar}/{totalBars}</span>
        <span>{timeSignature}</span>
        <span>Key: {keySignature}</span>
      </div>
    </div>
  );
}
