"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";

export interface ExplorerEntry {
  id: string;
  /** category label used by the filter chips (null = uncategorised) */
  category: string | null;
  /** lowercased text used for client-side search */
  searchText: string;
  /** server-rendered card */
  node: ReactNode;
}

interface ExplorerProps {
  entries: ExplorerEntry[];
  searchable?: boolean;
  searchPlaceholder?: string;
  /** grid column classes */
  gridClassName?: string;
  emptyTitle?: string;
}

/**
 * Generic filterable/searchable grid. Cards are rendered on the server and
 * passed in as `node`; this client wrapper only filters + animates them.
 */
export function Explorer({
  entries,
  searchable = true,
  searchPlaceholder = "Search…",
  gridClassName = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
  emptyTitle = "Nothing matches your filters",
}: ExplorerProps) {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => e.category && set.add(e.category));
    return ["All", ...Array.from(set).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchCat = active === "All" || e.category === active;
      const matchQ = !q || e.searchText.includes(q);
      return matchCat && matchQ;
    });
  }, [entries, active, query]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {categories.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active === cat}
                onClick={() => setActive(cat)}
                className={cn("chip", active === cat && "chip-active")}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}

        {searchable && (
          <div className="relative w-full sm:w-64">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search"
              className="w-full rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-content placeholder:text-content-muted focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" aria-hidden>
              ⌕
            </span>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} hint="Try clearing your search or selecting a different category." />
      ) : (
        <div className={gridClassName}>
          <AnimatePresence mode="popLayout">
            {filtered.map((e) => (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {e.node}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
