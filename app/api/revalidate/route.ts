import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { SANITY_CACHE_TAG } from '@/lib/content/source'

/**
 * Called by a Sanity webhook whenever content is published, so the live site
 * updates within seconds while pages stay statically cached and fast.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ message: 'SANITY_REVALIDATE_SECRET is not set' }, { status: 500 })
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret)
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    // Next request after publishing gets fresh content (no stale window).
    revalidateTag(SANITY_CACHE_TAG, { expire: 0 })
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 })
  }
}
