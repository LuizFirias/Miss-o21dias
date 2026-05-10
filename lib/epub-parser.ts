import JSZip from 'jszip';
import { getR2Object } from './r2';

interface EpubCache {
  images: string[];
  zip: JSZip;
}

// Module-level cache: persists between requests in the same Node.js process
const cache = new Map<string, EpubCache>();

function resolveHref(base: string, href: string): string {
  if (href.startsWith('/')) return href.slice(1);
  const parts = base.split('/');
  parts.pop();
  for (const seg of href.split('/')) {
    if (seg === '..') parts.pop();
    else if (seg !== '.') parts.push(seg);
  }
  return parts.join('/');
}

async function extractOrderedImages(zip: JSZip): Promise<string[]> {
  try {
    // 1. container.xml → OPF path
    const containerXml = await zip.file('META-INF/container.xml')?.async('string') ?? '';
    const opfPath = containerXml.match(/full-path="([^"]+)"/)?.[1];
    if (!opfPath) throw new Error('No OPF path');

    // 2. OPF → manifest + spine
    const opfXml = await zip.file(opfPath)?.async('string') ?? '';

    const manifest = new Map<string, string>();
    for (const tag of opfXml.match(/<item[^>]+>/g) ?? []) {
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      if (id && href) manifest.set(id, resolveHref(opfPath, href));
    }

    const spineSection = opfXml.match(/<spine[\s\S]*?<\/spine>/)?.[0] ?? '';
    const idrefs = [...spineSection.matchAll(/idref="([^"]+)"/g)].map(m => m[1]);

    // 3. For each spine item (HTML), find its main image
    const images: string[] = [];
    for (const idref of idrefs) {
      const htmlPath = manifest.get(idref);
      if (!htmlPath) continue;
      const html = await zip.file(htmlPath)?.async('string') ?? '';

      const imgSrc =
        html.match(/<img[^>]+src="([^"]+)"/i)?.[1] ??
        html.match(/<image[^>]+xlink:href="([^"]+)"/i)?.[1] ??
        html.match(/<image[^>]+href="([^"]+)"/i)?.[1];

      if (imgSrc && !imgSrc.startsWith('data:')) {
        images.push(resolveHref(htmlPath, decodeURIComponent(imgSrc)));
      }
    }

    if (images.length > 0) return images;
  } catch {
    // fall through to fallback
  }

  // Fallback: all images sorted by path
  return Object.keys(zip.files)
    .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f) && !zip.files[f].dir)
    .sort();
}

export async function getEpubCache(filePath: string): Promise<EpubCache> {
  if (cache.has(filePath)) return cache.get(filePath)!;

  const data = await getR2Object(filePath);
  const zip = await JSZip.loadAsync(data);
  const images = await extractOrderedImages(zip);

  const entry: EpubCache = { zip, images };
  cache.set(filePath, entry);
  return entry;
}

export function epubFilePath(segments: string[]): string {
  return segments.join('/');
}
