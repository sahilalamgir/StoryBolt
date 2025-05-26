"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function SignUpLauncher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openSignUp } = useClerk();

  useEffect(() => {
    if (searchParams.get("openSignUp") === "true") {
      // 1) open the Clerk sign‑in modal
      openSignUp();

      // 2) strip the query params so they don’t re‑fire
      const params = new URLSearchParams(searchParams.toString());
      params.delete("openSignUp");
      params.delete("redirectTo");
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, openSignUp, router]);

  return null;
}