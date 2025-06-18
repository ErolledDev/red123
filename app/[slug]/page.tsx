import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import SlugRedirectPage from './SlugRedirectPage'

interface RedirectData {
  title: string
  desc: string
  url: string
  image: string
  keywords: string
  site_name: string
  type: string
}

interface RedirectsData {
  [slug: string]: RedirectData
}

async function getRedirectData(slug: string): Promise<RedirectData | null> {
  try {
    const filePath = path.join(process.cwd(), 'redirects.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    const redirects: RedirectsData = JSON.parse(fileContents)
    return redirects[slug] || null
  } catch (error) {
    console.error('Error reading redirects file:', error)
    return null
  }
}

async function getAllRedirects(): Promise<RedirectsData> {
  try {
    const filePath = path.join(process.cwd(), 'redirects.json')
    const fileContents = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading redirects file:', error)
    return {}
  }
}

// Remove generateStaticParams for SSR
// export async function generateStaticParams() {
//   const redirects = await getAllRedirects()
//   
//   return Object.keys(redirects).map((slug) => ({
//     slug: slug,
//   }))
// }

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = await getRedirectData(params.slug)
  
  if (!data) {
    return {
      title: 'Page Not Found | seo360',
      description: 'The requested page could not be found.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  const canonicalUrl = `${baseUrl}/${params.slug}`

  return {
    title: `${data.title} | seo360`,
    description: data.desc,
    keywords: data.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.title,
      description: data.desc,
      type: data.type as any,
      images: data.image ? [data.image] : [],
      siteName: data.site_name,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.desc,
      images: data.image ? [data.image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  const data = await getRedirectData(params.slug)
  const allRedirects = await getAllRedirects()
  
  if (!data) {
    notFound()
  }

  return <SlugRedirectPage data={data} allRedirects={allRedirects} currentSlug={params.slug} />
}