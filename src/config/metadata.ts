import packageJson from '~/../package.json';

const cleanUrl = 'artframe.stophe.com';

const metadata = {
  website: {
    name: 'ArtFrame Editor',
    slogan: `Editor for Framelab's ArtFrame`,
    description: `Editor for Framelab's ArtFrame. Open-source canvas drawing web application, built with TypeScript, React, and Next.js.`,
    cleanUrl: cleanUrl,
    email: `x@stophe.com`,
    url: `https://${cleanUrl}`,
    manifest: `https://${cleanUrl}/manifest.json`,
    thumbnail: `https://${cleanUrl}/images/thumbnail.jpg`,
    locale: 'en',
    themeColor: '#FFFFFF',
    version: packageJson.version,
  },
  links: {
    github: 'https://github.com/stophecom/artframe-editor',
  },
};

export default metadata;
