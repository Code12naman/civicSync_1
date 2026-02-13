import { NextResponse } from 'next/server';
import { analyzeIssueImageFormFields } from '@/ai/flows/analyze-issue-image-flow';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get('image');
    const description = (formData.get('description') as string) || '';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    // Default to jpeg; rely on provided type if available
    const mime = file.type || 'image/jpeg';
    const base64 = bytes.toString('base64');
    const dataUri = `data:${mime};base64,${base64}`;

    const result = await analyzeIssueImageFormFields({ imageDataUri: dataUri, description });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    const msg = String(err?.message || err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
