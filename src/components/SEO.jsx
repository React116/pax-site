import { Helmet } from 'react-helmet-async';

const OG_IMAGE = 'https://www.paxgroupglobal.com/logo.jpeg';
const BASE_URL = 'https://www.paxgroupglobal.com';

const LANG_CODE = { tr: 'tr', en: 'en', ru: 'ru', me: 'sr-ME' };
const HREFLANG  = { tr: 'tr', en: 'en', ru: 'ru', me: 'sr-ME' };

const SEO = ({ title, description, path = '', lang = 'en' }) => {
  const canonical = `${BASE_URL}${path}`;
  const htmlLang  = LANG_CODE[lang] || 'en';

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Hreflang — dil varyantları */}
      {Object.entries(HREFLANG).map(([code, hreflang]) => (
        <link key={code} rel="alternate" hreflang={hreflang} href={`${BASE_URL}${path}?lang=${code}`} />
      ))}
      <link rel="alternate" hreflang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content="PAX GROUP" />
      <meta property="og:locale" content={htmlLang} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};

export default SEO;
