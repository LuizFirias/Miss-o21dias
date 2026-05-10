import { NextResponse } from 'next/server';
import { getEpubCache, epubFilePath } from '@/lib/epub-parser';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const { searchParams } = new URL(req.url);
    const idx = parseInt(searchParams.get('idx') ?? '0', 10);

    const { zip, images } = await getEpubCache(epubFilePath(path));

    if (idx < 0 || idx >= images.length) {
      return NextResponse.json({ error: 'Page out of range' }, { status: 404 });
    }

    const imgPath = images[idx];
    const data = await zip.file(imgPath)?.async('nodebuffer');
    if (!data) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

    const ext = imgPath.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mime =
      ext === 'png' ? 'image/png' :
      ext === 'webp' ? 'image/webp' :
      'image/jpeg';

    return new NextResponse(new Uint8Array(data), {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (e) {
    console.error('Page error:', e);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
