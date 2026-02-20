export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export type InstrumentType = 'drum' | 'bass' | 'piano' | 'vocal' | 'strings' | 'brass' | 'synth' | 'guitar';

export function getInstrumentType(name: string): InstrumentType {
  const lower = name.toLowerCase();
  if (lower.includes('drum') || lower.includes('percussion')) return 'drum';
  if (lower.includes('bass')) return 'bass';
  if (lower.includes('piano') || lower.includes('key')) return 'piano';
  if (lower.includes('vocal') || lower.includes('voice') || lower.includes('sing')) return 'vocal';
  if (lower.includes('string') || lower.includes('violin') || lower.includes('cello')) return 'strings';
  if (lower.includes('trumpet') || lower.includes('brass') || lower.includes('horn') || lower.includes('trombone')) return 'brass';
  if (lower.includes('synth') || lower.includes('pad')) return 'synth';
  return 'guitar';
}
