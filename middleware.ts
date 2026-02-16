// Next.js Middleware for Security, CORS & Rate Limiting
// Applies to all /api/* routes

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  chatRateLimit,
  apiRateLimit,
  getClientIdentifier,
  checkRateLimit,
  createRateLimitHeaders,
} from "./lib/rate-limit";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "https://ourark.io",
  "https://www.ourark.io",
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : null,
].filter(Boolean) as string[];

// Check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // Allow all localhost origins in development
  if (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost")) {
    return true;
  }
  
  return ALLOWED_ORIGINS.includes(origin);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // ===== RATE LIMITING =====
  // Apply to API routes only
  if (pathname.startsWith("/api/")) {
    const identifier = getClientIdentifier(request);
    
    // Choose appropriate rate limiter based on endpoint
    const limiter = pathname.includes("/chat") ? chatRateLimit : apiRateLimit;
    const rateLimit = await checkRateLimit(identifier, limiter);

    // If rate limit exceeded, return 429
    if (!rateLimit.success) {
      const response = NextResponse.json(
        {
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
        },
        { status: 429 }
      );

      // Add rate limit headers
      const headers = createRateLimitHeaders(rateLimit);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }
  }
  
  // ===== CORS PREFLIGHT =====
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    
    if (origin && isOriginAllowed(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
    }
    
    return response;
  }

  // Create response
  const response = NextResponse.next();

  // ===== CORS HEADERS =====
  // Apply to API routes
  if (pathname.startsWith("/api/")) {
    if (origin && isOriginAllowed(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
  }

  // ===== SECURITY HEADERS =====
  // Applied to all routes
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // HSTS (HTTP Strict Transport Security) - nur in Production
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

// Apply middleware to API routes only
export const config = {
  matcher: [
    "/api/:path*",
    // Optionally protect other routes
    // "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
