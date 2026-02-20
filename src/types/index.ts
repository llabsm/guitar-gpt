import type { AlphaTabApi } from '@coderline/alphatab';

export interface TrackInfo {
  index: number;
  name: string;
  channel: number;
  instrument: string;
  color: string;
  isMuted: boolean;
  isSolo: boolean;
  volume: number;
  pan: number;
}

export interface LoopRegion {
  startBar: number;
  endBar: number;
}

export type PlayerState = 'stopped' | 'playing' | 'paused';

export interface PlayerStore {
  // alphaTab API
  api: AlphaTabApi | null;
  setApi: (api: AlphaTabApi | null) => void;

  // Score info
  score: any;
  setScore: (score: any) => void;
  songTitle: string;
  songArtist: string;

  // Tracks
  tracks: TrackInfo[];
  setTracks: (tracks: TrackInfo[]) => void;
  selectedTrackIndices: number[];
  selectTrack: (index: number, multi?: boolean) => void;
  toggleMute: (index: number) => void;
  toggleSolo: (index: number) => void;
  setTrackVolume: (index: number, volume: number) => void;
  setTrackPan: (index: number, pan: number) => void;

  // Playback
  playerState: PlayerState;
  setPlayerState: (state: PlayerState) => void;
  currentTime: number;
  totalTime: number;
  setCurrentTime: (time: number) => void;
  setTotalTime: (time: number) => void;
  currentBar: number;
  totalBars: number;
  setCurrentBar: (bar: number) => void;
  setTotalBars: (bars: number) => void;

  // Tempo
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;

  // Volume
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  isMasterMuted: boolean;
  toggleMasterMute: () => void;

  // Zoom
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;

  // Loop
  isLooping: boolean;
  toggleLoop: () => void;
  loopRegion: LoopRegion | null;
  setLoopRegion: (region: LoopRegion | null) => void;

  // Bar navigation
  goToBar: (barIndex: number) => void;

  // Mixer
  showMixer: boolean;
  toggleMixer: () => void;

  // SoundFont loading
  soundFontProgress: number;
  setSoundFontProgress: (progress: number) => void;
  isPlayerReady: boolean;
  setPlayerReady: (ready: boolean) => void;
  isRendering: boolean;
  setRendering: (rendering: boolean) => void;

  // File loaded
  hasFile: boolean;
  setHasFile: (has: boolean) => void;

  // Time signature
  timeSignature: string;
  setTimeSignature: (ts: string) => void;
  keySignature: string;
  setKeySignature: (ks: string) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;
}
