import { useEffect, useRef, useCallback } from 'react';
import { AlphaTabApi, Settings, LogLevel, LayoutMode, StaveProfile, TabRhythmMode } from '@coderline/alphatab';
import { usePlayerStore, TRACK_COLORS } from '../stores/usePlayerStore.ts';
import type { TrackInfo } from '../types/index.ts';

const KEY_SIG_NAMES: Record<number, string> = {
  [-7]: 'Cb', [-6]: 'Gb', [-5]: 'Db', [-4]: 'Ab', [-3]: 'Eb', [-2]: 'Bb', [-1]: 'F',
  [0]: 'C', [1]: 'G', [2]: 'D', [3]: 'A', [4]: 'E', [5]: 'B', [6]: 'F#', [7]: 'C#',
};

export function useAlphaTab(containerRef: React.RefObject<HTMLDivElement | null>) {
  const apiRef = useRef<AlphaTabApi | null>(null);
  const {
    setApi,
    setScore,
    setTracks,
    setPlayerState,
    setCurrentTime,
    setTotalTime,
    setCurrentBar,
    setTotalBars,
    setSoundFontProgress,
    setPlayerReady,
    setRendering,
    setHasFile,
    setTimeSignature,
    setKeySignature,
    setError,
    zoomLevel,
  } = usePlayerStore();

  const initApi = useCallback(() => {
    if (!containerRef.current || apiRef.current) return;

    const settings = new Settings();
    settings.core.logLevel = LogLevel.Warning;
    const base = import.meta.env.BASE_URL || '/';
    settings.core.fontDirectory = `${base}font/`;
    settings.player.enablePlayer = true;
    settings.player.enableCursor = true;
    settings.player.enableUserInteraction = true;
    settings.player.soundFont = `${base}soundfont/MuseScore_General.sf2`;
    settings.display.layoutMode = LayoutMode.Page;
    settings.display.staveProfile = StaveProfile.Default;
    settings.notation.rhythmMode = TabRhythmMode.ShowWithBars;

    const api = new AlphaTabApi(containerRef.current, settings);
    apiRef.current = api;
    setApi(api);

    // Score loaded
    api.scoreLoaded.on((score: any) => {
      setScore(score);
      setHasFile(true);
      setError(null);

      const trackInfos: TrackInfo[] = score.tracks.map((track: any, i: number) => ({
        index: i,
        name: track.name,
        channel: track.playbackInfo.primaryChannel,
        instrument: track.name,
        color: TRACK_COLORS[i % TRACK_COLORS.length],
        isMuted: false,
        isSolo: false,
        volume: 100,
        pan: 50,
      }));
      setTracks(trackInfos);

      // Total bars + initial time/key signatures
      let totalBars = 0;
      if (score.masterBars.length > 0) {
        totalBars = score.masterBars.length;
        const firstBar = score.masterBars[0];
        setTimeSignature(`${firstBar.timeSignatureNumerator}/${firstBar.timeSignatureDenominator}`);
        const keySig = firstBar.keySignature as number;
        setKeySignature(KEY_SIG_NAMES[keySig] ?? 'C');
      }
      setTotalBars(totalBars);
      setCurrentBar(1);

      // Render first track
      if (score.tracks.length > 0) {
        api.renderTracks([score.tracks[0]]);
      }
    });

    // Track current beat/bar during playback — also update time/key signatures
    api.playedBeatChanged.on((beat: any) => {
      if (beat?.voice?.bar) {
        const barIndex = beat.voice.bar.index;
        setCurrentBar(barIndex + 1);

        // Update time signature if it changed for this bar
        const store = usePlayerStore.getState();
        if (store.score) {
          const masterBar = store.score.masterBars[barIndex];
          if (masterBar) {
            const timeSig = `${masterBar.timeSignatureNumerator}/${masterBar.timeSignatureDenominator}`;
            if (timeSig !== store.timeSignature) {
              setTimeSignature(timeSig);
            }
            const keySig = KEY_SIG_NAMES[masterBar.keySignature as number];
            if (keySig && keySig !== store.keySignature) {
              setKeySignature(keySig);
            }
          }
        }
      }
    });

    // Player state — PlayerState enum: Paused=0, Playing=1
    api.playerStateChanged.on((e: any) => {
      if (e.state === 1) {
        setPlayerState('playing');
      } else if (e.stopped) {
        setPlayerState('stopped');
      } else {
        setPlayerState('paused');
      }
    });

    // Position changed
    api.playerPositionChanged.on((e: any) => {
      setCurrentTime(e.currentTime);
      setTotalTime(e.endTime);
    });

    // Render started
    api.renderStarted.on(() => {
      setRendering(true);
    });

    // Render finished
    api.renderFinished.on(() => {
      setRendering(false);
    });

    // SoundFont loading
    api.soundFontLoad.on((e: any) => {
      const progress = e.loaded / e.total;
      setSoundFontProgress(progress);
    });

    api.soundFontLoaded.on(() => {
      setSoundFontProgress(1);
    });

    // Player ready
    api.playerReady.on(() => {
      setPlayerReady(true);
    });

    // Error handling
    api.error.on((e: any) => {
      console.error('alphaTab error:', e);
      setError(e?.message ?? 'An error occurred while processing the file.');
    });
  }, [containerRef, setApi, setScore, setTracks, setPlayerState, setCurrentTime, setTotalTime, setCurrentBar, setTotalBars, setSoundFontProgress, setPlayerReady, setRendering, setHasFile, setTimeSignature, setKeySignature, setError]);

  useEffect(() => {
    initApi();
    return () => {
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
        setApi(null);
      }
    };
  }, [initApi, setApi]);

  // Update zoom
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.settings.display.scale = zoomLevel;
      apiRef.current.updateSettings();
      apiRef.current.render();
    }
  }, [zoomLevel]);

  return apiRef;
}
