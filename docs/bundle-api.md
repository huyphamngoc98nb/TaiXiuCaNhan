# Bundle API — Sprint 1.2

> API cấp phát metadata OTA update cho app TaiXiuCaNhan.
> App (Capacitor) gọi API này trong background, so sánh version,
> tải bundle mới nếu có. Không tập trung hoá file .zip, chỉ trả metadata.

---

## Cài đặt & chạy local

```bash
cd server
npm install
cp .env.example .env   # chỉnh sửa CDN_BASE_URL
npm run dev            # http://localhost:3001
```

---

## Endpoints

### `GET /api/health`

Kiểm tra server còn sống.

**Response 200**
```json
{
  "status": "ok",
  "timestamp": "2026-05-12T15:00:00.000Z",
  "service": "taixiu-bundle-api"
}
```

---

### `GET /api/updates/bundle/latest`

Kiểm tra xem app có bundle mới hay không.

**Headers bắt buộc**

| Header | Mô tả | Ví dụ |
|--------|---------|--------|
| `x-native-version` | versionName của APK hiện tại | `0.1.0` |
| `x-bundle-version` | bundleVersion app đang chạy | `0.1.0-b1` |

**Headers tuỳ chọn**

| Header | Mặc định | Mô tả |
|--------|-----------|--------|
| `x-platform` | `android` | `android` \| `ios` |
| `x-channel` | `stable` | `stable` \| `beta` |

---

### Response Cases

#### Case 1: Có bundle mới, native tương thích → dùng Chiến lược B

```json
{
  "hasUpdate": true,
  "update": {
    "channel": "stable",
    "bundleVersion": "0.1.1-b2",
    "bundleUrl": "https://cdn.example.com/bundles/stable/0.1.1-b2.zip",
    "sha256": "abc123...",
    "minNativeVersion": "0.1.0",
    "mandatory": false,
    "releaseNotes": "Sửa lỗi hiển thị budget",
    "publishedAt": 1747100000000
  },
  "nativeRequired": null
}
```

#### Case 2: Bundle mới yêu cầu native mới hơn → dùng Chiến lược A

```json
{
  "hasUpdate": false,
  "update": null,
  "nativeRequired": {
    "minNativeVersion": "0.2.0",
    "downloadUrl": "https://cdn.example.com/apk/0.2.0.apk",
    "mandatory": true
  }
}
```

#### Case 3: Đã là phiên bản mới nhất

```json
{
  "hasUpdate": false,
  "update": null,
  "nativeRequired": null
}
```

#### Case 4: Thiếu header

```http
HTTP/1.1 400 Bad Request

{
  "error": "Missing required header: x-native-version",
  "code": "MISSING_HEADER"
}
```

---

## Sườ dụng từ Capacitor app

```typescript
// src/services/updateCheckService.ts
const resp = await fetch('https://api.taixiucanhan.com/api/updates/bundle/latest', {
  headers: {
    'x-native-version': nativeVersionName,   // lấy từ @capacitor/app
    'x-bundle-version': currentBundleVersion, // lấy từ localStorage / SQLite
    'x-platform': 'android',
    'x-channel': 'stable',
  },
});
const data = await resp.json(); // BundleCheckResponse
```

---

## Cấp nhật Manifest

Khi publish bundle mới, thêm entry vào `server/data/bundle-manifest.json`:

```json
{
  "channel": "stable",
  "bundleVersion": "0.1.1-b2",
  "bundleUrl": "https://cdn.example.com/bundles/stable/0.1.1-b2.zip",
  "sha256": "<sha256 của file .zip>",
  "minNativeVersion": "0.1.0",
  "mandatory": false,
  "releaseNotes": "Mô tả ngắn",
  "publishedAt": 1747100000000
}
```

> `publishedAt` là epoch ms. Tạo nhanh: `Date.now()` trong Node console.
> Server đọc manifest mỗi request — không cần restart khi thêm entry.

---

## Lưu đồ quyết định

```
GET /api/updates/bundle/latest
        ↓
validateHeaders
  ├─ thiếu header → 400
  └─ ok →
        ↓
checkBundleUpdate(nativeVer, bundleVer, channel)
  ├─ không có entry nào  → { hasUpdate: false }
  ├─ native không đủ → { nativeRequired: {...} }   ⇒ Chiến lược A
  ├─ bundle đã mới     → { hasUpdate: false }
  └─ có bundle mới     → { hasUpdate: true, update: {...} } ⇒ Chiến lược B
```

---

## Sprint tiếp theo (1.3)

- **Client OTA Service**: `src/services/updateCheckService.ts` — gọi API này, tải bundle,
  giải nén, verify SHA-256, rollback
- **Cẩn deploy server**: Railway / Render / VPS — sườ dụng `.env.example` làm template
