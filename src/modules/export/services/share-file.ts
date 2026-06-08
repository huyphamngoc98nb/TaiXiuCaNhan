import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

function parseBase64DataUri(content: string, fallbackMimeType: string) {
  const match = content.match(/^data:([^;,]+)?(?:;[^,]*)?;base64,(.*)$/s);
  if (!match) return null;

  return {
    mimeType: match[1] || fallbackMimeType,
    base64: match[2],
  };
}

function base64ToBlob(base64: string, mimeType: string) {
  const binary = window.atob(base64);
  const chunks: ArrayBuffer[] = [];

  for (let offset = 0; offset < binary.length; offset += 1024) {
    const slice = binary.slice(offset, offset + 1024);
    const buffer = new ArrayBuffer(slice.length);
    const bytes = new Uint8Array(buffer);
    for (let index = 0; index < slice.length; index += 1) {
      bytes[index] = slice.charCodeAt(index);
    }
    chunks.push(buffer);
  }

  return new Blob(chunks, { type: mimeType });
}

export async function shareFile(fileName: string, content: string, mimeType: string): Promise<void> {
  const platform = Capacitor.getPlatform();
  const dataUri = parseBase64DataUri(content, mimeType);

  if (platform === 'web') {
    // Standard web download
    const blob = dataUri
      ? base64ToBlob(dataUri.base64, dataUri.mimeType)
      : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  // Native share flow
  try {
    const result = dataUri
      ? await Filesystem.writeFile({
          path: fileName,
          data: dataUri.base64,
          directory: Directory.Cache,
        })
      : await Filesystem.writeFile({
          path: fileName,
          data: content,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });

    await Share.share({
      title: fileName,
      url: result.uri,
      dialogTitle: `Share ${fileName}`,
    });
  } catch (error) {
    console.error('Sharing failed', error);
    throw error;
  }
}
