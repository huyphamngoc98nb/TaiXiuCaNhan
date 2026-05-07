import { validateBackupPayload } from './validate-backup-payload';
import { restoreDatabase } from './restore-database';
import { BackupPayload } from '../domain/backup.model';

export async function importBackupJson(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const payload = JSON.parse(text);
        
        const validation = validateBackupPayload(payload);
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid backup file');
        }
        
        await restoreDatabase(payload as BackupPayload);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
