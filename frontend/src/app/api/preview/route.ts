import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type') || 'tour';

  // Validate the secret token (should match STRAPI_PREVIEW_SECRET in Strapi)
  const previewSecret = process.env.PREVIEW_SECRET || 'sonhangtravel-preview-2026';
  
  if (secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the preview page based on type
  if (type === 'tour') {
    redirect(`/tour/${slug}`);
  } else if (type === 'category') {
    redirect(`/tours/${slug}`);
  } else {
    redirect('/');
  }
}
