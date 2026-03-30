import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/AuthForms";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to your Caranci Creations account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Welcome back"
      description="Sign in with Google to access your member perks and stay in touch about bookings."
    >
      <LoginForm />
    </AuthShell>
  );
}
