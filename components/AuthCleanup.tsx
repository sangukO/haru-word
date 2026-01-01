"use client";

import { useEffect } from "react";

export default function AuthCleanup() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash.includes("error=access_denied")
    ) {
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  return null;
}
