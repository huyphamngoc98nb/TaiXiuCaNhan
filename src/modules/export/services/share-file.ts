import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export async function shareFile(fileName: string, content: string, mimeType: string): Promise<void> {
  const platform = Capacitor.getPlatform();

  if (platform === 'web') {
    // Standard web download
    const blob = new Blob([content], { type: mimeType });
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
    const result = await Filesystem.writeFile({
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
