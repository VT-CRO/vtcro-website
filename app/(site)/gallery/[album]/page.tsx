import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from '@/components/icons'
import { PhotoGrid } from '@/components/photos/PhotoGrid'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAlbum, getAlbums } from '@/lib/content'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'

export const revalidate = 3600

export async function generateStaticParams() {
  return (await getAlbums()).map((a) => ({ album: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }): Promise<Metadata> {
  const album = await getAlbum((await params).album)
  if (!album) return {}
  return {
    title: album.title,
    description: album.description || `Photos from VT CRO.`,
    alternates: { canonical: `/gallery/${album.slug}` },
    openGraph: { images: album.cover ? [{ url: album.cover.src, alt: album.cover.alt }] : [DEFAULT_SHARE_IMAGE] },
  }
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const album = await getAlbum((await params).album)
  if (!album) notFound()
  return (
    <Section first>
      <SectionHeader
        as="h1"
        heading={album.title}
        action={
          <Link href="/gallery" className="link-arrow">
            <ArrowLeft size={16} /> Gallery
          </Link>
        }
      />
      <PhotoGrid photos={album.photos} />
    </Section>
  )
}
