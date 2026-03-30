"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

const enter = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
} as const;

export function LoginForm() {
  return (
    <motion.div {...enter} className="space-y-8">
      <GoogleSignInButton label="Sign in with Google" />
      <p className="text-center text-sm leading-relaxed text-zinc-500">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#d4c4a8] underline decoration-[#a89968]/40 underline-offset-4 transition-colors hover:text-[#f5f2ed] hover:decoration-[#a89968]"
        >
          Create an account
        </Link>{" "}
        with Google — quick and secure.
      </p>
    </motion.div>
  );
}

export function SignupForm() {
  return (
    <motion.div {...enter} className="space-y-8">
      <GoogleSignInButton label="Sign up with Google" />
      <p className="text-center text-sm leading-relaxed text-zinc-500">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-medium text-[#d4c4a8] underline decoration-[#a89968]/40 underline-offset-4 transition-colors hover:text-[#f5f2ed] hover:decoration-[#a89968]"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
