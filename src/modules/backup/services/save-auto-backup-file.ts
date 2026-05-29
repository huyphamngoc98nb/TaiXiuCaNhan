import { Capacitor } from '@capacitor/core';
import { documentSaver } from '@/core/files/document-saver';
import { saveBackupFile } from './save-backup-file';

const BACKUP_MIME_TYPE = 'application/json';
const AUTO_BACKUP_DOWNLOAD_DIRECTORY = 'Expense Tracker';

export async function saveAutoBackupFile(fileName: string, content: string): Promise<boolean> {
  if (Capacitor.getPlatform() === 'android') {
    const result = await documentSaver.saveTextFileToDownloads({
      fileName,
      content,
      mimeType: BACKUP_MIME_TYPE,
      directoryName: AUTO_BACKUP_DOWNLOAD_DIRECTORY,
    });

    return result.saved;
  }

  return saveBackupFile(fileName, content);
}
