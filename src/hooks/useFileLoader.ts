import { useCallback } from 'react';
import { usePlayerStore } from '../stores/usePlayerStore.ts';

const SUPPORTED_EXTENSIONS = ['.gp3', '.gp4', '.gp5', '.gpx', '.gp'];

export function useFileLoader() {
  const { api, setError } = usePlayerStore();

  const loadFile = useCallback(async (file: File) => {
    if (!api) {
      setError('Player not initialized yet. Please wait a moment and try again.');
      return;
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file format "${ext}". Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      api.load(new Uint8Array(buffer));
    } catch (err) {
      console.error('Failed to load file:', err);
      setError(`Failed to load "${file.name}". The file may be corrupted or in an unsupported format.`);
    }
  }, [api, setError]);

  const openFilePicker = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = SUPPORTED_EXTENSIONS.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) loadFile(file);
    };
    input.click();
  }, [loadFile]);

  return { loadFile, openFilePicker };
}
