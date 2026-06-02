import { normalizeBackupPayload } from './validate-backup-payload';
import { restoreDatabase } from './restore-database';

async function readBackupFile(file: File): Promise<string> {
  if (typeof file.text === 'function') {
    try {
      return await file.text();
    } catch {
      // Some Android WebView file providers expose a File but fail through
      // Blob.text(). Fall back to FileReader, which can handle other providers.
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        reject(new Error('Backup file could not be read as text'));
        return;
      }
      resolve(text);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file, 'UTF-8');
  });
}

export async function importBackupJson(file: File): Promise<void> {
  const text = await readBackupFile(file);
  const payload = JSON.parse(text);

  await restoreDatabase(normalizeBackupPayload(payload));
}
