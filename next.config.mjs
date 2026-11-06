/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a second dev server (e.g. the editor preview) build into its own folder instead of fighting over `.next`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    // Admin uploads go through server actions (15 MB per file + form overhead).
    serverActions: { bodySizeLimit: "16mb" },
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "same-origin" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};
export default nextConfig;
