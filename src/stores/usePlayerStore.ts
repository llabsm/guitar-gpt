import { create } from 'zustand';
import type { PlayerStore, TrackInfo } from '../types/index.ts';

const TRACK_COLORS = [
  '#e94560', '#0f3460', '#00b4d8', '#06d6a0', '#ffd166',
  '#ef476f', '#118ab2', '#073b4c', '#8338ec', '#ff6b6b',
];

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  api: null,
  setApi: (api) => set({ api }),

  score: null,
  setScore: (score) => set({
    score,
    songTitle: score?.title ?? 'Untitled',
    songArtist: score?.artist ?? 'Unknown Artist',
  }),
  songTitle: 'Untitled',
  songArtist: 'Unknown Artist',

  tracks: [],
  setTracks: (tracks) => set({ tracks }),
  selectedTrackIndices: [0],
  selectTrack: (index, multi = false) => {
    const { selectedTrackIndices, api } = get();
    let newSelection: number[];
    if (multi) {
      if (selectedTrackIndices.includes(index)) {
        newSelection = selectedTrackIndices.filter(i => i !== index);
        if (newSelection.length === 0) newSelection = [index];
      } else {
        newSelection = [...selectedTrackIndices, index];
      }
    } else {
      newSelection = [index];
    }
    set({ selectedTrackIndices: newSelection });
    if (api) {
      const score = get().score;
      if (score) {
        const renderTracks = newSelection.map(i => score.tracks[i]).filter(Boolean);
        api.renderTracks(renderTracks);
      }
    }
  },

  toggleMute: (index) => {
    const { tracks, api, score } = get();
    const updated = tracks.map((t, i) =>
      i === index ? { ...t, isMuted: !t.isMuted } : t
    );
    set({ tracks: updated });
    if (api && score) {
      const track = score.tracks[index];
      if (track) {
        api.changeTrackMute([track], !tracks[index].isMuted);
      }
    }
  },

  toggleSolo: (index) => {
    const { tracks, api, score } = get();
    const updated = tracks.map((t, i) =>
      i === index ? { ...t, isSolo: !t.isSolo } : t
    );
    set({ tracks: updated });
    if (api && score) {
      const track = score.tracks[index];
      if (track) {
        api.changeTrackSolo([track], !tracks[index].isSolo);
      }
    }
  },

  setTrackVolume: (index, volume) => {
    const { tracks, api, score } = get();
    const updated = tracks.map((t, i) =>
      i === index ? { ...t, volume } : t
    );
    set({ tracks: updated });
    if (api && score) {
      const track = score.tracks[index];
      if (track) {
        api.changeTrackVolume([track], volume / 100);
      }
    }
  },

  setTrackPan: (index, pan) => {
    const { tracks } = get();
    const updated = tracks.map((t, i) =>
      i === index ? { ...t, pan } : t
    );
    set({ tracks: updated });
  },

  playerState: 'stopped',
  setPlayerState: (playerState) => set({ playerState }),
  currentTime: 0,
  totalTime: 0,
  setCurrentTime: (currentTime) => set({ currentTime }),
  setTotalTime: (totalTime) => set({ totalTime }),
  currentBar: 0,
  totalBars: 0,
  setCurrentBar: (currentBar) => set({ currentBar }),
  setTotalBars: (totalBars) => set({ totalBars }),

  playbackSpeed: 1,
  setPlaybackSpeed: (playbackSpeed) => {
    set({ playbackSpeed });
    const { api } = get();
    if (api) {
      api.playbackSpeed = playbackSpeed;
    }
  },

  masterVolume: 100,
  setMasterVolume: (masterVolume) => {
    set({ masterVolume });
    const { api } = get();
    if (api) {
      api.masterVolume = masterVolume / 100;
    }
  },
  isMasterMuted: false,
  toggleMasterMute: () => {
    const { isMasterMuted, api, masterVolume } = get();
    set({ isMasterMuted: !isMasterMuted });
    if (api) {
      api.masterVolume = isMasterMuted ? masterVolume / 100 : 0;
    }
  },

  zoomLevel: 1.0,
  setZoomLevel: (zoomLevel) => {
    set({ zoomLevel: Math.min(2.0, Math.max(0.5, zoomLevel)) });
  },

  isLooping: false,
  toggleLoop: () => {
    const { isLooping, api } = get();
    set({ isLooping: !isLooping });
    if (api) {
      api.isLooping = !isLooping;
    }
  },
  loopRegion: null,
  setLoopRegion: (loopRegion) => {
    set({ loopRegion });
    const { api, score } = get();
    if (api && score) {
      if (loopRegion) {
        const tickCache = api.tickCache;
        if (tickCache) {
          const startMasterBar = score.masterBars[loopRegion.startBar];
          const endMasterBar = score.masterBars[loopRegion.endBar];
          if (startMasterBar && endMasterBar) {
            const startTick = tickCache.getMasterBarStart(startMasterBar);
            const endLookup = tickCache.getMasterBar(endMasterBar);
            api.playbackRange = { startTick, endTick: endLookup.end };
            api.isLooping = true;
            set({ isLooping: true });
          }
        }
      } else {
        api.playbackRange = null;
        api.isLooping = false;
        set({ isLooping: false });
      }
    }
  },

  // Bar navigation
  goToBar: (barIndex) => {
    const { api, score } = get();
    if (!api || !score) return;
    const tickCache = api.tickCache;
    if (!tickCache) return;
    if (barIndex < 0 || barIndex >= score.masterBars.length) return;
    const masterBar = score.masterBars[barIndex];
    const startTick = tickCache.getMasterBarStart(masterBar);
    api.tickPosition = startTick;
  },

  showMixer: false,
  toggleMixer: () => set((s) => ({ showMixer: !s.showMixer })),

  soundFontProgress: 0,
  setSoundFontProgress: (soundFontProgress) => set({ soundFontProgress }),
  isPlayerReady: false,
  setPlayerReady: (isPlayerReady) => set({ isPlayerReady }),
  isRendering: false,
  setRendering: (isRendering) => set({ isRendering }),

  hasFile: false,
  setHasFile: (hasFile) => set({ hasFile }),

  timeSignature: '4/4',
  setTimeSignature: (timeSignature) => set({ timeSignature }),
  keySignature: 'C',
  setKeySignature: (keySignature) => set({ keySignature }),

  error: null,
  setError: (error) => set({ error }),
}));

export { TRACK_COLORS };
