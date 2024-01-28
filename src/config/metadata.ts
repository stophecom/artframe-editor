import packageJson from '~/../package.json';

const cleanUrl = 'stophe.com';

const metadata = {
  website: {
    name: 'ArtFrame Editor',
    slogan: 'Editor for Framelabs ArtFrames',
    description: 'Open-source canvas drawing web application, built with TypeScript, React, and Next.js.',
    cleanUrl,
    email: `hello@${cleanUrl}`,
    url: `https://${cleanUrl}`,
    manifest: `https://${cleanUrl}/manifest.json`,
    thumbnail: `https://${cleanUrl}/images/thumbnail.jpg`,
    locale: 'en',
    themeColor: '#FFFFFF',
    version: packageJson.version,
  },
};

export default metadata;
