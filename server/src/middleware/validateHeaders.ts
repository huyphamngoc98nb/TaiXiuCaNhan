import { Request, Response, NextFunction } from 'express';

/**
 * Kiểm tra header bắt buộc:
 *   x-native-version : SemVer của APK hiện tại (ví dụ: "0.1.0")
 *   x-bundle-version : version bundle hiện tại client đang chạy (ví dụ: "0.1.0-b1")
 *   x-platform       : "android" | "ios" (chưa dùng, gửi để sẵn sàng sau này)
 */
export function validateUpdateHeaders(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const nativeVersion = req.headers['x-native-version'];
  const bundleVersion = req.headers['x-bundle-version'];

  if (!nativeVersion || typeof nativeVersion !== 'string') {
    res.status(400).json({
      error: 'Missing required header: x-native-version',
      code: 'MISSING_HEADER',
    });
    return;
  }

  if (!bundleVersion || typeof bundleVersion !== 'string') {
    res.status(400).json({
      error: 'Missing required header: x-bundle-version',
      code: 'MISSING_HEADER',
    });
    return;
  }

  next();
}
