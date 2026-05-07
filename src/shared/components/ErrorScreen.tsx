
interface ErrorScreenProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', padding: '16px', textAlign: 'center' }}>
      <h2 style={{ color: 'red', marginBottom: '8px' }}>Something went wrong</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{errorMessage}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
