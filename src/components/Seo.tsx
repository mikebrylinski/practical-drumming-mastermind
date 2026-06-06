import { useEffect } from 'react'

type SeoProps = {
  title: string
  description?: string
  /** Absolute URL or a path under /public (e.g. "/about-mike.png"). */
  image?: string
  /** Path for the canonical URL (e.g. "/about"). Defaults to current path. */
  canonicalPath?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
}

const SITE_NAME = 'Practical Drumming — Mastermind Club'
const DEFAULT_DESCRIPTION =
  'Premium drumming mentorship with Mike Malinin — former Goo Goo Dolls drummer.'
const DEFAULT_IMAGE = '/logo-dd.png'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-page document metadata (title, description, Open Graph, Twitter,
 * canonical). The base SPA is client-rendered, so this updates the head on
 * navigation; crawlers that execute JS (Google) read the result.
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  canonicalPath,
  type = 'website',
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const origin = window.location.origin
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const url = `${origin}${canonicalPath ?? window.location.pathname}`
    const absoluteImage = /^https?:\/\//.test(image) ? image : `${origin}${image}`

    document.title = fullTitle

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', absoluteImage)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', absoluteImage)

    upsertLink('canonical', url)
  }, [title, description, image, canonicalPath, type, noindex])

  return null
}
