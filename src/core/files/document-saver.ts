import { registerPlugin } from '@capacitor/core';

interface SaveTextFileOptions {
  fileName: string;
  content: string;
  mimeType: string;
}

interface SaveTextFileResult {
  saved: boolean;
  uri?: string;
}

interface DocumentSaverPlugin {
  saveTextFile(options: SaveTextFileOptions): Promise<SaveTextFileResult>;
}

export const documentSaver = registerPlugin<DocumentSaverPlugin>('DocumentSaver');
