/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 *
 * Every allowance below is something the built site actually loads — verified
 * against the served HTML and the client chunks. If you add a font host, an
 * analytics provider or another remote image, it has to be added here too or
 * the browser will block it.
 *
 * script-src carries 'unsafe-inline' because Next injects inline bootstrap
 * scripts into every prerendered page. The alternative is a per-request nonce
 * from middleware, which forces all routes to render dynamically and gives up
 * static prerendering. For a site with no auth, no user input and no HTML
 * sinks, that trade isn't worth it.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // static.cloudflareinsights.com: Cloudflare Web Analytics. Cloudflare's
  // proxy injects its beacon into every page, so it is allowed here rather
  // than blocked.
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://static.cloudflareinsights.com${isDev ? " 'unsafe-eval'" : ""}`,
  // Fonts are self-hosted by next/font, so no font host is needed.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data:",
  // Videos (the Tributary recording) are same-origin.
  "media-src 'self'",
  // cloudflareinsights.com is where the beacon reports to.
  `connect-src 'self' https://va.vercel-scripts.com https://cloudflareinsights.com${isDev ? " ws: http://localhost:*" : ""}`,
  // The certificate and resume viewers frame same-origin PDFs from /pdf.
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // 'self' rather than 'none': the PDFs above are framed by our own pages.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Redundant with frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // No includeSubDomains: blog.swayam.li is a separate deployment and this
  // policy should not make promises on its behalf.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig = {
  // 90 is used for screenshots and document previews, where text must stay sharp.
  images: { qualities: [75, 90] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Skills and Certificates now live on the About page. The old URLs keep
  // working; /certificates/:slug is unchanged.
  async redirects() {
    return [
      { source: "/skills", destination: "/about#skills", permanent: true },
      { source: "/certificates", destination: "/about#certificates", permanent: true },
    ];
  },
};

export default nextConfig;
