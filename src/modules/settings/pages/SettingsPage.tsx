import { DatabaseDiagnostics } from '../components/DatabaseDiagnostics';

export function SettingsPage() {
  return (
    <div>
      <div className="header">Settings</div>
      <div className="container">
        <div className="card">
          <p>Settings options will go here.</p>
        </div>
        
        <DatabaseDiagnostics />
      </div>
    </div>
  );
}
