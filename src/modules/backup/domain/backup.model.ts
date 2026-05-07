export interface BackupMetadata {
  version: string;
  exported_at: number;
  app_version: string;
}

export interface BackupPayload {
  metadata: BackupMetadata;
  wallets: any[];
  categories: any[];
  transactions: any[];
  recurring_bills: any[];
  app_settings: any[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
