import { Capacitor } from '@capacitor/core';
import { documentSaver } from '@/core/files/document-saver';

const BACKUP_MIME_TYPE = 'application/json';

function downloadInBrowser(fileName: string, content: string) {
  const blob = new Blob([content], { type: BACKUP_MIME_TYPE });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function saveBackupFile(fileName: string, content: string): Promise<boolean> {
  if (Capacitor.getPlatform() === 'android') {
    const result = await documentSaver.saveTextFile({
      fileName,
      content,
      mimeType: BACKUP_MIME_TYPE,
    });

    return result.saved;
  }

  downloadInBrowser(fileName, content);
  return true;
}
