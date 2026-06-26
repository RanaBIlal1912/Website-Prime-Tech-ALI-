import { PageHero } from "@/components/ui";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export interface LegalSection {
  heading: string;
  body: string[];
}

export function LegalLayout({
  title,
  updated,
  intro,
  sections,
  path,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  path: string;
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} subtitle={`Last updated: ${updated}`} />
      <section className="section">
        <div className="container-x max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: title, path },
            ]}
          />
          <p className="prose-content">{intro}</p>
          <div className="mt-8 space-y-8">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl font-bold text-content">{s.heading}</h2>
                <div className="prose-content mt-3 space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
