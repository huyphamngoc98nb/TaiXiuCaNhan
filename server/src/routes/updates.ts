import { Router, Request, Response } from 'express';
import { validateUpdateHeaders } from '../middleware/validateHeaders';
import { checkBundleUpdate } from '../services/bundleService';

const router = Router();

/**
 * GET /api/health
 * Health check — dùng cho load balancer / uptime monitor.
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'taixiu-bundle-api',
  });
});

/**
 * GET /api/updates/bundle/latest
 *
 * Headers bắt buộc:
 *   x-native-version : ví dụ: "0.1.0"
 *   x-bundle-version : ví dụ: "0.1.0-b1"
 *
 * Headers tuỳ chọn:
 *   x-platform       : "android" | "ios"
 *   x-channel        : "stable" | "beta" (default: "stable")
 *
 * Response 200: BundleCheckResponse
 * Response 400: Thiếu header bắt buộc
 * Response 500: Lỗi đọc manifest
 */
router.get(
  '/updates/bundle/latest',
  validateUpdateHeaders,
  (req: Request, res: Response) => {
    try {
      const nativeVersion  = req.headers['x-native-version'] as string;
      const bundleVersion  = req.headers['x-bundle-version'] as string;
      const channel        = (req.headers['x-channel'] as string | undefined) ?? 'stable';

      const result = checkBundleUpdate(nativeVersion, bundleVersion, channel);
      res.json(result);
    } catch (err) {
      console.error('[BundleAPI] Error:', err);
      res.status(500).json({
        error: 'Internal server error',
        code: 'MANIFEST_ERROR',
      });
    }
  },
);

export default router;
