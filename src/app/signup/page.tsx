import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Caranci Creations account.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Account"
      title="Join the studio"
      description="One tap with Google — no extra passwords. We’ll keep you posted on offers and session availability."
    >
      <SignupForm />
    </AuthShell>
  );
}
