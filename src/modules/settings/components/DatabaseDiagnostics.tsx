import { useState, useEffect } from 'react';
import { isDatabaseReady } from '@/core/db/sqlite/connection';
import { getSchemaVersion, listTables, countCategories } from '@/core/db/sqlite/health';

export function DatabaseDiagnostics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      const ready = await isDatabaseReady();
      const version = await getSchemaVersion();
      const tables = await listTables();
      const cats = await countCategories();

      const requiredTables = ['wallets', 'categories', 'transactions', 'recurring_bills', 'app_settings', 'sync_changes'];
      const tableCheck = requiredTables.map(t => ({ name: t, exists: tables.includes(t) }));

      setStats({ ready, version, tableCheck, cats });
    }
    loadStats();
  }, []);

  if (!import.meta.env.DEV) return null; // Only show in dev mode
  if (!stats) return <div style={{ padding: '16px', color: 'var(--text-muted)' }}>Loading diagnostics...</div>;

  return (
    <div className="card" style={{ marginTop: '16px', border: '1px solid var(--primary)', backgroundColor: 'var(--bg)' }}>
      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', fontSize: '1.1rem' }}>Developer Diagnostics</h3>
      <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
        <p><strong>DB Initialized:</strong> {stats.ready ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Schema Version:</strong> {stats.version}</p>
        <p><strong>Seeded Categories:</strong> {stats.cats}</p>
      </div>
      
      <h4 style={{ marginTop: '16px', marginBottom: '8px', fontSize: '1rem' }}>Required Tables:</h4>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'grid', gap: '4px' }}>
        {stats.tableCheck.map((t: any) => (
          <li key={t.name} style={{ color: t.exists ? 'var(--text)' : 'red', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{t.exists ? '✅' : '❌'}</span>
            <span style={{ fontFamily: 'monospace' }}>{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
