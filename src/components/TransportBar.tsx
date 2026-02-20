import { Play, Pause, Square, Repeat, LocateFixed, Volume2, VolumeX } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore.ts';
import { formatTime } from '../utils/formatTime.ts';

export default function TransportBar() {
  const {
    api,
    playerState,
    currentTime,
    totalTime,
    playbackSpeed,
    setPlaybackSpeed,
    masterVolume,
    setMasterVolume,
    isMasterMuted,
    toggleMasterMute,
    isLooping,
    toggleLoop,
    isPlayerReady,
    currentBar,
    totalBars,
    loopRegion,
    setLoopRegion,
  } = usePlayerStore();

  const handlePlayPause = () => {
    if (!api) return;
    api.playPause();
  };

  const handleStop = () => {
    if (!api) return;
    api.stop();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!api) return;
    const pos = Number(e.target.value);
    api.timePosition = pos;
  };

  const handleSetLoopStart = () => {
    const endBar = loopRegion?.endBar ?? currentBar - 1;
    const startBar = currentBar - 1;
    if (startBar <= endBar) {
      setLoopRegion({ startBar, endBar });
    } else {
      setLoopRegion({ startBar, endBar: startBar });
    }
  };

  const handleSetLoopEnd = () => {
    const startBar = loopRegion?.startBar ?? 0;
    const endBar = currentBar - 1;
    if (endBar >= startBar) {
      setLoopRegion({ startBar, endBar });
    } else {
      setLoopRegion({ startBar: endBar, endBar });
    }
  };

  const handleClearLoop = () => {
    setLoopRegion(null);
  };

  return (
    <div className="bg-[#16213e] border-t border-[#2a3a5c] px-4 py-2 shrink-0">
      {/* Seek bar */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs text-[#8899bb] w-10 text-right font-mono tabular-nums">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={totalTime || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1"
        />
        <span className="text-xs text-[#8899bb] w-10 font-mono tabular-nums">
          {formatTime(totalTime)}
        </span>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Transport buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStop}
            disabled={!isPlayerReady}
            className="w-8 h-8 flex items-center justify-center text-[#8899bb] hover:text-white bg-[#1a1a2e] hover:bg-[#2a3a5c] rounded transition-colors disabled:opacity-30 disabled:hover:bg-[#1a1a2e]"
            title="Stop (Esc)"
          >
            <Square size={14} fill="currentColor" />
          </button>
          <button
            onClick={handlePlayPause}
            disabled={!isPlayerReady}
            className="w-10 h-10 flex items-center justify-center text-white bg-[#e94560] hover:bg-[#d63a55] rounded-full transition-colors disabled:opacity-30 shadow-lg shadow-[#e94560]/20"
            title="Play/Pause (Space)"
          >
            {playerState === 'playing' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>

          {/* Loop controls */}
          <button
            onClick={toggleLoop}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              isLooping
                ? 'text-[#e94560] bg-[#e94560]/20'
                : 'text-[#6677aa] hover:text-[#a0b0d0] bg-[#1a1a2e] hover:bg-[#2a3a5c]'
            }`}
            title="Loop (L)"
          >
            <Repeat size={14} />
          </button>
          <button
            onClick={handleSetLoopStart}
            disabled={!isPlayerReady}
            className="h-6 px-1.5 text-[10px] font-bold text-[#6677aa] hover:text-[#a0b0d0] bg-[#1a1a2e] hover:bg-[#2a3a5c] rounded transition-colors disabled:opacity-30"
            title="Set loop start at current bar"
          >
            A&#x25B8;
          </button>
          <button
            onClick={handleSetLoopEnd}
            disabled={!isPlayerReady}
            className="h-6 px-1.5 text-[10px] font-bold text-[#6677aa] hover:text-[#a0b0d0] bg-[#1a1a2e] hover:bg-[#2a3a5c] rounded transition-colors disabled:opacity-30"
            title="Set loop end at current bar"
          >
            &#x25C2;B
          </button>
          {loopRegion && (
            <>
              <span className="text-[10px] text-[#8899bb] font-mono">
                {loopRegion.startBar + 1}–{loopRegion.endBar + 1}
              </span>
              <button
                onClick={handleClearLoop}
                className="h-6 px-1.5 text-[10px] text-[#e94560] hover:text-[#ff6b82] font-bold"
                title="Clear loop region"
              >
                &#x2715;
              </button>
            </>
          )}
        </div>

        {/* Tempo */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#6677aa] font-medium uppercase">Tempo</span>
          <input
            type="range"
            min={0.25}
            max={2}
            step={0.05}
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-24 h-1"
          />
          <span className="text-xs text-[#a0b0d0] w-10 font-mono tabular-nums">
            {Math.round(playbackSpeed * 100)}%
          </span>
          {playbackSpeed !== 1 && (
            <button
              onClick={() => setPlaybackSpeed(1)}
              className="text-xs text-[#e94560] hover:text-[#ff6b82] font-medium"
            >
              Reset
            </button>
          )}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMasterMute}
            className="text-[#8899bb] hover:text-white transition-colors"
            title="Toggle mute"
          >
            {isMasterMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMasterMuted ? 0 : masterVolume}
            onChange={(e) => setMasterVolume(Number(e.target.value))}
            className="w-20 h-1"
          />
        </div>

        {/* Bar counter */}
        <div className="flex items-center gap-1.5 text-xs text-[#8899bb] font-mono tabular-nums">
          <LocateFixed size={12} className="text-[#6677aa]" />
          Bar {currentBar} / {totalBars}
        </div>
      </div>
    </div>
  );
}
