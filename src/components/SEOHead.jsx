import { useEffect } from 'react';

export const SEOHead = ({
  title = 'CelStore™ | E-Commerce Generacional de Celulares & Modelos 3D',
  description = 'Descubre teléfonos de los últimos 2 años y clásicos vintage en 3D. ¿Qué soluciona para tu vida?',
  image = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200',
  url = window.location.href,
  type = 'website'
}) => {
  useEffect(() => {
    // 1. Document Title
    document.title = title;

    // Helper to set meta tags
    const setMetaTag = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);

    // 3. OpenGraph Meta Tags (WhatsApp, Facebook, LinkedIn, iMessage)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', url);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'CelStore');

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
  }, [title, description, image, url, type]);

  return null;
};
