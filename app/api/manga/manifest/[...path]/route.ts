import { NextResponse } from 'next/server';
import { getEpubCache, epubFilePath } from '@/lib/epub-parser';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const { images } = await getEpubCache(epubFilePath(path));
    return NextResponse.json({ count: images.length });
  } catch (e) {
    console.error('Manifest error:', e);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
