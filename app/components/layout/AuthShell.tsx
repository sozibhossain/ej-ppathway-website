import type { ReactNode } from "react";

type Variant = "login" | "signup";

/**
 * Centered auth layout — just the form card on a soft branded background.
 * (`variant` is accepted for call-site compatibility but no longer renders a
 * side panel.)
 */
export function AuthShell({ children }: { variant: Variant; children: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f0f9fb] to-[#eaf6f9] min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center justify-center">
      {/* Soft decorative accents */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#0e7490]/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[#0e7490]/10 blur-3xl" aria-hidden="true" />

      <div className="container-page relative py-10 sm:py-14 w-full flex justify-center">
        {children}
      </div>
    </section>
  );
}
