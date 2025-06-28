import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export function SEOHead({
  title = 'Ahmad Kanaan - Full-Stack Developer Portfolio',
  description = 'Experienced full-stack developer specializing in React, Node.js, and modern web technologies. View my projects, blog, and get in touch.',
  keywords = ['full-stack developer', 'react', 'nodejs', 'web development', 'portfolio', 'ahmad kanaan'],
  image = '/og-image.jpg',
  url = 'https://ahmadkanaan.dev',
  type = 'website',
  author = 'Ahmad Kanaan',
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords.join(', '))
    updateMetaTag('author', author)

    // Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:site_name', 'Ahmad Kanaan Portfolio', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:creator', '@ahmadkanaan')

    // Article specific tags
    if (type === 'article') {
      updateMetaTag('article:author', author, true)
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true)
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true)
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // JSON-LD structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'profile' ? 'Person' : 'WebSite',
      name: author,
      url: url,
      description: description,
      image: image,
      ...(type === 'profile' && {
        jobTitle: 'Full-Stack Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'Freelance'
        },
        sameAs: [
          'https://github.com/ahmadkanaan',
          'https://linkedin.com/in/ahmadkanaan',
          'https://twitter.com/ahmadkanaan'
        ]
      })
    }

    let jsonLd = document.querySelector('script[type="application/ld+json"]')
    if (!jsonLd) {
      jsonLd = document.createElement('script')
      jsonLd.setAttribute('type', 'application/ld+json')
      document.head.appendChild(jsonLd)
    }
    jsonLd.textContent = JSON.stringify(structuredData)

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime])

  return null
}