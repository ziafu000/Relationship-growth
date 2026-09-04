import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const activityPhotoOrigin = supabaseUrl ? new URL(supabaseUrl) : null;
const activityPhotoPattern = activityPhotoOrigin
  ? {
      protocol: activityPhotoOrigin.protocol.slice(0, -1) as 'http' | 'https',
      hostname: activityPhotoOrigin.hostname,
      port: activityPhotoOrigin.port,
      pathname: '/storage/v1/object/sign/activity_images/**',
    }
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: activityPhotoPattern ? [activityPhotoPattern] : [],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
