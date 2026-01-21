/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static Export für Cloudflare Pages
  output: 'export',
  
  // Trailing Slashes für statisches Hosting
  trailingSlash: true,
  
  // Bilder müssen unoptimiert sein für Static Export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
