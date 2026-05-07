import { ValidationResult } from '../domain/backup.model';

export function validateBackupPayload(payload: any): ValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Invalid file format' };
  }

  // Check required sections
  const requiredSections = ['metadata', 'wallets', 'categories', 'transactions', 'recurring_bills', 'app_settings'];
  for (const section of requiredSections) {
    if (!payload[section]) {
      return { isValid: false, error: `Missing required section: ${section}` };
    }
  }

  // Basic array validation
  const arraySections = ['wallets', 'categories', 'transactions', 'recurring_bills', 'app_settings'];
  for (const section of arraySections) {
    if (!Array.isArray(payload[section])) {
      return { isValid: false, error: `Section ${section} must be an array` };
    }
  }

  // Metadata validation
  if (!payload.metadata.version || !payload.metadata.exported_at) {
    return { isValid: false, error: 'Invalid or missing metadata' };
  }

  // Version compatibility check (MVP: only support v1)
  if (payload.metadata.version !== '1.0') {
    return { isValid: false, error: `Unsupported backup version: ${payload.metadata.version}` };
  }

  return { isValid: true };
}
