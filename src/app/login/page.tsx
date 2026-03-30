import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/AuthForms";
import { LoginAuthErrorBanner } from "@/components/LoginAuthErrorBanner";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your blankcreations account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back"
      description="Sign in with Google to manage your profile, invoices, and messages."
    >
      <LoginAuthErrorBanner />
      <LoginForm />
    </AuthShell>
  );
}
