import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="bg-brand-gradient bg-clip-text text-7xl font-black text-transparent sm:text-8xl">404</p>
      <h1 className="mt-4 text-3xl font-bold text-content">Page not found</h1>
      <p className="mt-3 max-w-md text-content-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="chip hover:border-primary/50 hover:text-content">
            {l.label}
          </Link>
        ))}
      </div>
      <Link href="/" className="btn-primary btn-sm mt-8">
        Back to home
      </Link>
    </div>
  );
}
