import Link from "next/link";

export function Breadcrumbs({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-content-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i < items.length - 1 ? (
              <Link href={item.path} className="transition-colors hover:text-primary">
                {item.name}
              </Link>
            ) : (
              <span className="text-content">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
