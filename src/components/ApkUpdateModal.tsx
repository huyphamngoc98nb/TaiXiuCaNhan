import { useEffect, useState } from 'react';
import {
  cancelApkDownload,
  subscribeToApkDownload,
  type ApkDownloadState,
} from '@/services/apkDownloadService';

const initialState: ApkDownloadState = {
  status: 'idle',
  apkUrl: null,
  downloadedBytes: 0,
  totalBytes: null,
  bytesPerSecond: 0,
  mandatory: false,
  filePath: null,
  error: null,
};

function getProgressPercent(downloadedBytes: number, totalBytes: number | null): number {
  if (!totalBytes || totalBytes <= 0) {
    return 0;
  }

  return Math.min(Math.round((downloadedBytes / totalBytes) * 100), 100);
}

function formatSpeed(bytesPerSecond: number): string {
  if (bytesPerSecond < 1024 * 1024) {
    return `${Math.max(bytesPerSecond / 1024, 0).toFixed(1)} KB/s`;
  }

  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(bytes / 1024, 0).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApkUpdateModal() {
  const [state, setState] = useState<ApkDownloadState>(initialState);

  useEffect(() => subscribeToApkDownload(setState), []);

  if (state.status === 'idle' || state.status === 'cancelled' || state.status === 'completed') {
    return null;
  }

  const percent = getProgressPercent(state.downloadedBytes, state.totalBytes);
  const totalText = state.totalBytes === null ? '...' : formatBytes(state.totalBytes);
  const containerClassName = state.mandatory
    ? 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4'
    : 'pointer-events-none fixed inset-x-0 bottom-20 z-[10000] flex justify-center px-4';

  return (
    <div className={containerClassName} role={state.mandatory ? 'dialog' : 'status'} aria-live="polite">
      <section className="pointer-events-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-950">
            {state.mandatory ? 'Cập nhật bắt buộc' : 'Đang tải bản cập nhật'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {formatBytes(state.downloadedBytes)} / {totalText} · {formatSpeed(state.bytesPerSecond)}
          </p>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Tiến trình tải APK"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900">{state.totalBytes === null ? '...' : `${percent}%`}</span>
          <span className="text-slate-500">{formatSpeed(state.bytesPerSecond)}</span>
        </div>

        {state.status === 'error' ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            Tải bản cập nhật thất bại. Vui lòng thử lại.
          </p>
        ) : null}

        {!state.mandatory ? (
          <button
            type="button"
            className="mt-4 w-full rounded-[10px] bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-200"
            onClick={() => void cancelApkDownload()}
          >
            Để sau
          </button>
        ) : null}
      </section>
    </div>
  );
}
