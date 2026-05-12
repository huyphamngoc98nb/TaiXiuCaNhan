#!/usr/bin/env bash
# =============================================================
# build-bundle.sh
# Build OTA bundle: vite build -> zip -> SHA-256 -> ký RSA
#
# Yêu cầu:
#   - Node.js (để đọc version.config.json)
#   - openssl
#   - zip
#   - private_key.pem ở root project (KHÔNG commit git)
#
# Cách dùng:
#   bash scripts/build-bundle.sh
#
# Artifacts đầu ra (trong thư mục artifacts/):
#   <bundleVersion>.zip         — Web bundle
#   <bundleVersion>.zip.sha256  — SHA-256 checksum
#   <bundleVersion>.zip.sig     — Chữ ký RSA
# =============================================================
set -euo pipefail

# ----------------------------------------------------------
# Đường dẫn gốc project (thư mục chứa package.json)
# ----------------------------------------------------------
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
cd "$PROJECT_ROOT"

ARTIFACT_DIR="artifacts"
PRIVATE_KEY="private_key.pem"
VERSION_CONFIG="version.config.json"

# ----------------------------------------------------------
# Màu log
# ----------------------------------------------------------
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

log_step() { echo -e "\n${YELLOW}>> Step $1: $2${NC}"; }
log_ok()   { echo -e "   ${GREEN}✓${NC} $1"; }
log_err()  { echo -e "   ${RED}✗ ERROR: $1${NC}"; exit 1; }

echo "==========================================================="
echo " OTA Build Pipeline — TaiXiuCaNhan"
echo "==========================================================="

# ----------------------------------------------------------
# Kiểm tra dependencies trước khi bắt đầu
# ----------------------------------------------------------
for cmd in node npm openssl zip sha256sum; do
  command -v "$cmd" &>/dev/null || log_err "Thiếu dependency: $cmd"
done

[ -f "$PRIVATE_KEY" ] || log_err "Không tìm thấy $PRIVATE_KEY. Chạy: bash scripts/generate-keypair.sh"
[ -f "$VERSION_CONFIG" ] || log_err "Không tìm thấy $VERSION_CONFIG"

# ==========================================================
# STEP 1 — Đọc bundleVersion từ version.config.json
# ==========================================================
log_step 1 "Đọc bundleVersion từ $VERSION_CONFIG"

BUNDLE_VERSION=$(node -e "
  const v = require('./$VERSION_CONFIG');
  if (!v.bundleVersion) process.exit(1);
  process.stdout.write(v.bundleVersion);
")

[ -n "$BUNDLE_VERSION" ] || log_err "bundleVersion rỗng trong $VERSION_CONFIG"
log_ok "bundleVersion = \"$BUNDLE_VERSION\""

# Tên artifacts
ZIP_FILE="${ARTIFACT_DIR}/${BUNDLE_VERSION}.zip"
SHA_FILE="${ZIP_FILE}.sha256"
SIG_FILE="${ZIP_FILE}.sig"

# ==========================================================
# STEP 2 — Build web assets (vite build)
# ==========================================================
log_step 2 "npm run build"

npm run build

[ -d "dist" ] || log_err "dist/ không tồn tại sau khi build. Kiểm tra lỗi vite."
log_ok "dist/ đã được tạo"

# ==========================================================
# STEP 3 — Zip toàn bộ dist/ thành artifacts/<bundleVersion>.zip
# ==========================================================
log_step 3 "Zip dist/ -> $ZIP_FILE"

mkdir -p "$ARTIFACT_DIR"

# Xoá zip cũ nếu tồn tại (tránh zip --update hành vi không mong muốn)
[ -f "$ZIP_FILE" ] && rm -f "$ZIP_FILE"

# Zip từ trong dist/ để tránh path prefix "dist/" bên trong archive
(cd dist && zip -r "${OLDPWD}/${ZIP_FILE}" .)

ZIP_SIZE=$(du -sh "$ZIP_FILE" | awk '{print $1}')
log_ok "$ZIP_FILE (${ZIP_SIZE})"

# ==========================================================
# STEP 4 — Tính SHA-256 checksum
# ==========================================================
log_step 4 "Tính SHA-256 checksum -> $SHA_FILE"

# sha256sum output: "<hash>  <filename>" — chỉ lấy hash
sha256sum "$ZIP_FILE" | awk '{print $1}' > "$SHA_FILE"

CHECKSUM=$(cat "$SHA_FILE")
log_ok "SHA-256: $CHECKSUM"

# ==========================================================
# STEP 5 — Ký số bằng private_key.pem
# ==========================================================
log_step 5 "Ký RSA-SHA256 -> $SIG_FILE"

openssl dgst \
  -sha256 \
  -sign "$PRIVATE_KEY" \
  -out "$SIG_FILE" \
  "$ZIP_FILE"

log_ok "$SIG_FILE"

# ----------------------------------------------------------
# Quick verify chữ ký ngay sau khi ký
# ----------------------------------------------------------
if [ -f "public_key.pem" ]; then
  VERIFY=$(openssl dgst -sha256 -verify public_key.pem -signature "$SIG_FILE" "$ZIP_FILE" 2>&1)
  if echo "$VERIFY" | grep -q "Verified OK"; then
    log_ok "Verify chữ ký: OK"
  else
    log_err "Verify chữ ký thất bại! Output: $VERIFY"
  fi
else
  echo "   (Bỏ qua verify: public_key.pem không có ở local)"
fi

# ==========================================================
# TÓM TẮT — Danh sách 3 artifacts
# ==========================================================
echo ""
echo "==========================================================="
echo -e " ${GREEN}BUILD THÀNH CÔNG${NC} — bundleVersion: $BUNDLE_VERSION"
echo "==========================================================="
echo ""
echo " Artifacts:"
for f in "$ZIP_FILE" "$SHA_FILE" "$SIG_FILE"; do
  if [ -f "$f" ]; then
    SIZE=$(du -sh "$f" | awk '{print $1}')
    echo -e "   ${GREEN}✓${NC}  $f  ($SIZE)"
  else
    echo -e "   ${RED}✗${NC}  $f  (MISSING)"
  fi
done
echo ""
echo " Checksum: $CHECKSUM"
echo "==========================================================="
echo " Bước tiếp theo:"
echo "   1. Upload artifacts/ lên CDN"
echo "   2. Chạy scripts/update-manifest.js để cập nhật bundle-manifest.json"
echo "==========================================================="
