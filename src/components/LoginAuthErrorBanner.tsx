"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const MESSAGES: Record<string, string> = {
  Configuration:
    "Auth isn’t configured correctly on the server. On Vercel, set AUTH_SECRET, DATABASE_URL, AUTH_GOOGLE_ID, and AUTH_GOOGLE_SECRET, then redeploy. Run prisma migrate deploy if the database is new.",
  AccessDenied: "Sign-in was cancelled or your account is not allowed.",
  Verification: "The sign-in link expired or was already used. Try again.",
  OAuthSignin: "Could not start Google sign-in. Check Google OAuth client settings.",
  OAuthCallback:
    "Google returned an error. Confirm Authorized redirect URI matches https://YOUR-DOMAIN/api/auth/callback/google and AUTH_URL matches your live site.",
  OAuthCreateAccount: "Could not create your account in the database. Check DATABASE_URL and that migrations ran.",
  Callback: "Callback failed. Check server logs and database connectivity.",
  Default: "Sign-in failed. Check Vercel → Logs and environment variables.",
};

function BannerInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("error");
  if (!code) return null;

  const text = MESSAGES[code] ?? MESSAGES.Default;

  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-200/95"
    >
      <p className="font-medium text-red-100">Couldn’t sign you in</p>
      <p className="mt-2 text-red-200/85">{text}</p>
      {code === "Configuration" ? (
        <p className="mt-2 text-xs text-red-300/80">
          Error code: <code className="rounded bg-black/30 px-1">{code}</code>
        </p>
      ) : (
        <p className="mt-2 text-xs text-red-300/70">
          Code: <code className="rounded bg-black/30 px-1">{code}</code>
        </p>
      )}
    </div>
  );
}

export function LoginAuthErrorBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  );
}
