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
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // data: is the recoloured GitHub card on /about; raw.githubusercontent.com
  // is where the original comes from, and is also the no-JS fallback image.
  "img-src 'self' data: https://raw.githubusercontent.com",
  `connect-src 'self' https://raw.githubusercontent.com https://va.vercel-scripts.com${isDev ? " ws: http://localhost:*" : ""}`,
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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
