import { describe, expect, it } from 'vitest';
import { translations, type TranslationPath } from '@/shared/constants/translations';
import {
  getAppUpdateErrorMessage,
  getAppUpdateNativeErrorCode,
} from './app-update.errors';

function t(path: TranslationPath): string {
  return path.split('.').reduce<unknown>((value, key) => {
    return (value as Record<string, unknown>)[key];
  }, translations.vi) as string;
}

describe('app update error mapper', () => {
  it.each([
    ['APP_UPDATE_INVALID_INPUT', 'Thiếu thông tin cập nhật.'],
    [
      'APP_UPDATE_DOWNLOAD_FAILED',
      'Không thể tải bản cập nhật. Vui lòng kiểm tra kết nối mạng và thử lại.',
    ],
    [
      'APP_UPDATE_SHA256_MISMATCH',
      'File cập nhật không hợp lệ. Vui lòng thử lại sau.',
    ],
    ['APP_UPDATE_FILE_PROVIDER_FAILED', 'Không thể chuẩn bị file cập nhật.'],
    [
      'APP_UPDATE_INSTALL_PERMISSION_REQUIRED',
      'Bạn cần cấp quyền cài đặt ứng dụng từ nguồn này để tiếp tục.',
    ],
    [
      'APP_UPDATE_INSTALL_INTENT_FAILED',
      'Không thể mở màn hình cài đặt Android.',
    ],
    ['APP_UPDATE_UNKNOWN_ERROR', 'Đã xảy ra lỗi khi cập nhật ứng dụng.'],
  ] as const)('maps %s to its Vietnamese message', (code, message) => {
    expect(getAppUpdateNativeErrorCode({ code })).toBe(code);
    expect(getAppUpdateErrorMessage({ code }, t)).toBe(message);
  });

  it('maps unknown failures to the generic update message', () => {
    expect(getAppUpdateNativeErrorCode({ code: 'OTHER_ERROR' })).toBeNull();
    expect(getAppUpdateErrorMessage(new Error('failed'), t)).toBe(
      'Đã xảy ra lỗi khi cập nhật ứng dụng.',
    );
  });
});
