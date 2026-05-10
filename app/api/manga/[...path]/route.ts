import { NextResponse } from 'next/server';
import { getR2Object } from '@/lib/r2';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const key = path.join('/');
    const filename = path[path.length - 1] ?? '';

    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const mimeMap: Record<string, string> = {
      epub: 'application/epub+zip',
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };
    const contentType = mimeMap[ext] ?? 'application/octet-stream';
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

    const data = await getR2Object(key);

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': isImage ? 'public, max-age=86400' : 'no-store',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Manga API error:', error);
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
