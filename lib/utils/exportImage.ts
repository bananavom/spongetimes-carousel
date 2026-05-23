import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const TARGET_W = 1080;
const TARGET_H = 1350;

const overrideStyle: Partial<CSSStyleDeclaration> = {
  transform: 'none',
  transformOrigin: 'top left',
  width: `${TARGET_W}px`,
  height: `${TARGET_H}px`,
};

export async function slideToDataUrl(node: HTMLElement): Promise<string> {
  const noAnim = document.createElement('style');
  noAnim.textContent = '* { animation: none !important; transition: none !important; }';
  document.head.appendChild(noAnim);
  try {
    return await toPng(node, {
      pixelRatio: 1,
      width: TARGET_W,
      height: TARGET_H,
      cacheBust: true,
      style: overrideStyle as Record<string, string>,
      skipFonts: false,
    });
  } finally {
    document.head.removeChild(noAnim);
  }
}

export async function downloadSlide(node: HTMLElement, filename: string) {
  const dataUrl = await slideToDataUrl(node);
  const blob = await (await fetch(dataUrl)).blob();
  saveAs(blob, filename);
}

export async function downloadAllAsZip(
  nodes: HTMLElement[],
  zipName: string,
  slideNames?: string[]
) {
  const zip = new JSZip();
  const defaultNames = nodes.map((_, i) => `slide-${String(i + 1).padStart(2, '0')}.png`);
  const names = slideNames ?? defaultNames;

  for (let i = 0; i < nodes.length; i++) {
    const dataUrl = await slideToDataUrl(nodes[i]);
    const base64 = dataUrl.split(',')[1];
    zip.file(names[i], base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}
