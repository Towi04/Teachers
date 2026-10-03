import Link from "next/link";
import type { CSSProperties } from "react";
import { activityDefinitions } from "@/lib/content";

export default function Home() {
  return (
    <main className="tool-home">
      <nav className="topbar no-print" aria-label="Main navigation">
        <a className="brand" href="#top">
          MyOwnMaterials
        </a>
        <div>
          <a href="#tools">Tools</a>
          <a href="#plans">Plans</a>
        </div>
      </nav>

      <section className="tools-hero" id="top">
        <div>
          <p className="eyebrow">MyOwnMaterials</p>
          <h1>Every tool you need to create classroom materials.</h1>
          <p>
            Choose a printable activity, then configure it on its own page.
            Start with flashcards and keep expanding into puzzles, worksheets,
            quizzes, and more.
          </p>
        </div>
      </section>

      <section className="tool-grid-section" id="tools" aria-label="Tools">
        <div className="tool-grid">
          {activityDefinitions.map((activity) => (
            <Link
              className="tool-card"
              href={`/create/${activity.id}`}
              key={activity.id}
              style={{ "--activity-accent": activity.accent } as CSSProperties}
            >
              <span className="tool-icon">{activity.icon}</span>
              <div>
                <h2>{activity.title}</h2>
                <p>{activity.description}</p>
              </div>
              <span className={`activity-status status-${activity.status}`}>
                {activity.status === "available"
                  ? "Available"
                  : activity.status === "next"
                    ? "Next"
                    : "Planned"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-plans no-print" id="plans">
        <p>
          Free users can create printable materials with watermark. Members can
          unlock school logos, remove watermark, and access premium options.
        </p>
      </section>
    </main>
  );
}
