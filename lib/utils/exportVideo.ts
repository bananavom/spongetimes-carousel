import { saveAs } from 'file-saver';
import { toCanvas } from 'html-to-image';

const TARGET_W = 1080;
const TARGET_H = 1350;
const RECORD_DURATION = 7000; // 7초
const FPS = 24;

/**
 * 슬라이드를 MP4 영상으로 녹화
 */
export async function recordSlideToVideo(
  node: HTMLElement,
  filename: string,
  durationMs: number = RECORD_DURATION
): Promise<void> {
  // 캔버스 준비
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_W;
  canvas.height = TARGET_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // MediaRecorder 설정
  const stream = canvas.captureStream(FPS);
  
  // MIME 타입 (브라우저 지원 우선순위)
  const mimeCandidates = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=h264',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  
  let mimeType = 'video/webm';
  for (const candidate of mimeCandidates) {
    if (MediaRecorder.isTypeSupported(candidate)) {
      mimeType = candidate;
      break;
    }
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6000000, // 6Mbps
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = async () => {
      try {
        const blob = new Blob(chunks, { type: mimeType });
        
        // 확장자 결정
        const isMP4 = mimeType.includes('mp4');
        const ext = isMP4 ? 'mp4' : 'webm';
        const finalFilename = filename.replace(/\.[^.]+$/, `.${ext}`);
        
        saveAs(blob, finalFilename);
        resolve();
      } catch (err) {
        reject(err);
      }
    };

    recorder.onerror = (e) => {
      reject(new Error('Recording failed'));
    };

    // 녹화 시작
    recorder.start();

    // 프레임 캡처 루프
    const startTime = performance.now();
    let isStopped = false;

    const renderFrame = async () => {
      if (isStopped) return;
      
      const elapsed = performance.now() - startTime;
      
      if (elapsed >= durationMs) {
        isStopped = true;
        recorder.stop();
        return;
      }

      try {
        // html-to-image의 toCanvas로 캡처 (html2canvas보다 빠름)
        const frameCanvas = await toCanvas(node, {
          width: TARGET_W,
          height: TARGET_H,
          pixelRatio: 1,
          cacheBust: false,
          skipFonts: true, // 폰트 스킵으로 속도 향상
        });
        
        ctx.clearRect(0, 0, TARGET_W, TARGET_H);
        ctx.drawImage(frameCanvas, 0, 0, TARGET_W, TARGET_H);
      } catch (err) {
        console.error('Frame capture failed:', err);
      }

      // 다음 프레임 (requestAnimationFrame 사용 안 함, setTimeout으로 FPS 제어)
      setTimeout(renderFrame, 1000 / FPS);
    };

    renderFrame();
  });
}
