import { useEffect, useState } from 'react';
import { resolveSeo, SEO_CONFIGS } from '../lib/seo';

const managedSchemaId = 'mdrn-managed-schema';

export function SeoHead() {
  const [locationState, setLocationState] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));

  useEffect(() => {
    const update = () => {
      setLocationState({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });
    };

    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);

  useEffect(() => {
    const config = resolveSeo(locationState.pathname, locationState.hash);
    document.title = config.title;

    setMeta('name', 'description', config.description);
    setMeta('name', 'keywords', config.keywords ?? SEO_CONFIGS.home.keywords ?? '');
    setCanonical(config.canonical);
    setMeta('property', 'og:title', config.ogTitle);
    setMeta('property', 'og:description', config.ogDescription);
    setMeta('property', 'og:url', config.ogUrl);
    setMeta('property', 'og:type', config.ogType);
    setMeta('property', 'og:site_name', 'Mdrn-Life DDW');
    setMeta('property', 'og:image', config.image ?? '');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', config.twitterTitle);
    setMeta('name', 'twitter:description', config.twitterDescription);
    setMeta('name', 'twitter:image', config.image ?? '');
    setJsonLd(config.schema ?? []);
  }, [locationState.hash, locationState.pathname]);

  return null;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
}

function setJsonLd(schemaBlocks: Record<string, unknown>[]) {
  document.head.querySelectorAll(`script[data-managed="${managedSchemaId}"]`).forEach((node) => node.remove());
  schemaBlocks.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.managed = managedSchemaId;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}
