"use client";

// next-auth removed — this component is now a transparent passthrough.
export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
