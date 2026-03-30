/** Comma-separated in MANAGER_EMAILS; defaults below for blankcreations. */
export function managerEmailSet(): Set<string> {
  const raw =
    process.env.MANAGER_EMAILS ??
    "sashapbaranov@gmail.com,carancicreations1@gmail.com";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isManagerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return managerEmailSet().has(email.toLowerCase());
}
