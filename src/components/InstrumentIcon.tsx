import { Guitar, Drum, Piano, Mic, Music, Megaphone, AudioWaveform } from 'lucide-react';
import type { InstrumentType } from '../utils/formatTime.ts';

const iconMap: Record<InstrumentType, typeof Guitar> = {
  guitar: Guitar,
  bass: Guitar,
  drum: Drum,
  piano: Piano,
  vocal: Mic,
  strings: Music,
  brass: Megaphone,
  synth: AudioWaveform,
};

interface Props {
  type: InstrumentType;
  size?: number;
  className?: string;
}

export default function InstrumentIcon({ type, size = 16, className = '' }: Props) {
  const Icon = iconMap[type] || Guitar;
  return <Icon size={size} className={className} />;
}
