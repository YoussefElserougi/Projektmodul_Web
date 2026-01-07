/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment Variables die im Client verfügbar sein sollen
  // (n8n Webhook URL sollte nur serverseitig genutzt werden!)
  env: {
    // Füge hier public env vars hinzu falls nötig
  },
};

export default nextConfig;
