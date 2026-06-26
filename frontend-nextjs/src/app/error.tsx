"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface for observability; replace with your error tracker in production.
    console.error(error);
  }, [error]);

  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-bold text-content">We hit an unexpected error</h1>
      <p className="mt-3 max-w-md text-content-muted">
        Please try again. If the problem persists, contact our team and we&apos;ll help right away.
      </p>
      <div className="mt-8 flex gap-3">
        <button onClick={reset} className="btn-primary btn-sm">
          Try again
        </button>
        <Link href="/" className="btn-ghost btn-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}
