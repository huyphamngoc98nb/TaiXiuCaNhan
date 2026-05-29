import { registerPlugin } from '@capacitor/core';

interface SaveTextFileOptions {
  fileName: string;
  content: string;
  mimeType: string;
}

interface SaveTextFileToDownloadsOptions extends SaveTextFileOptions {
  directoryName?: string;
}

interface SaveTextFileResult {
  saved: boolean;
  uri?: string;
  path?: string;
}

interface DocumentSaverPlugin {
  saveTextFile(options: SaveTextFileOptions): Promise<SaveTextFileResult>;
  saveTextFileToDownloads(options: SaveTextFileToDownloadsOptions): Promise<SaveTextFileResult>;
}

export const documentSaver = registerPlugin<DocumentSaverPlugin>('DocumentSaver');
