/**
 * Video Helper Utilities for PixAI Studio
 * Handles real MP4 video downloads, canvas-to-video recording, and video asset resolution
 */

export const downloadVideoFile = async (videoUrl: string, filename: string) => {
  try {
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (err) {
    // Direct link fallback
    const a = document.createElement('a');
    a.href = videoUrl;
    a.target = '_blank';
    a.download = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

/**
 * Records an HTML Canvas into a real playable WebM/MP4 video blob
 */
export const recordCanvasToVideo = (
  canvas: HTMLCanvasElement,
  durationMs: number = 4000
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        resolve(videoBlob);
      };

      recorder.start();

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, durationMs);
    } catch (err) {
      reject(err);
    }
  });
};
