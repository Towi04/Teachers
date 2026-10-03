import { ActivityStudio } from "@/components/ActivityStudio";
import Image from "next/image";
import {
  activityDefinitions,
  planTiers,
  vocabularyAssets,
  vocabularySets,
} from "@/lib/content";

const roadmap = [
  {
    title: "Printable foundation",
    status: "Current focus",
    items: [
      "Reusable vocabulary and content collections",
      "Flashcard generator",
      "PDF-ready print layouts",
      "Public/private content rules",
    ],
  },
  {
    title: "More printable templates",
    status: "Next",
    items: [
      "Word search generator",
      "Matching worksheets",
      "Reading comprehension layouts",
      "Teacher template gallery",
    ],
  },
  {
    title: "Digital activities",
    status: "Later",
    items: [
      "Online practice modes",
      "Class join codes",
      "Student results",
      "H5P playback and authoring evaluation",
    ],
  },
];

export default function Home() {
  const vocabularySet = vocabularySets[0];

  return (
    <main>
      <nav className="topbar no-print" aria-label="Main navigation">
        <a className="brand" href="#top">
          MyOwnMaterials
        </a>
        <div>
          <a href="#create">Create</a>
          <a href="#library">Library</a>
          <a href="#pricing">Plans</a>
          <a href="#roadmap">Roadmap</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">MyOwnMaterials</p>
          <h1>What do you want to create today?</h1>
          <p>
            Pick an activity first, then configure its layout, images, print
            options, and member-only upgrades. We will expand each creator one
            activity at a time.
          </p>
          <div className="hero-actions no-print">
            <a className="primary-link" href="#create">
              Choose an activity
            </a>
            <a className="secondary-link" href="#roadmap">
              See the roadmap
            </a>
          </div>
        </div>

        <div className="hero-card no-print" aria-label="Available creators">
          <span>Printable creators</span>
          {activityDefinitions.slice(0, 4).map((activity) => (
            <strong key={activity.id}>{activity.title.replace("Create ", "")}</strong>
          ))}
        </div>
      </section>

      <ActivityStudio initialSet={vocabularySet} />

      <section className="library-section no-print" id="library">
        <div className="section-heading">
          <p className="eyebrow">Reusable asset library</p>
          <h2>Reduce duplicate uploads and keep public content safer.</h2>
          <p>
            Teachers can reuse approved images for common words. Public assets
            need clear license status before they can generate credits.
          </p>
        </div>

        <div className="asset-grid">
          {vocabularyAssets.map((asset) => (
            <article className="asset-card" key={asset.id}>
              <Image
                src={asset.imageUrl}
                alt={asset.alt}
                width={640}
                height={480}
              />
              <div>
                <span>{asset.word}</span>
                <strong>{asset.title}</strong>
                <small>{asset.licenseStatus}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="template-section no-print">
        <div className="section-heading">
          <p className="eyebrow">Activity-first workflow</p>
          <h2>Each material type gets its own focused settings.</h2>
          <p>
            Flashcards can have card size, frame color, images, print sides,
            fonts, and member-only branding. Crosswords, word searches, bingo,
            and worksheets will get their own panels as they are built.
          </p>
        </div>
        <div className="card-grid">
          {activityDefinitions.slice(0, 4).map((activity) => (
            <article className="info-card" key={activity.id}>
              <span
                aria-hidden="true"
                className="template-dot"
                style={{ background: activity.accent }}
              />
              <h3>{activity.title}</h3>
              <p>{activity.configurationHighlights.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section no-print" id="pricing">
        <div className="section-heading">
          <p className="eyebrow">Freemium model</p>
          <h2>Free creation, credit-based sharing, premium branding.</h2>
        </div>
        <div className="card-grid">
          {planTiers.map((plan) => (
            <article className="price-card" key={plan.id}>
              <h3>{plan.name}</h3>
              <p>{plan.publicDownloads}</p>
              <ul>
                <li>{plan.dailyDownloads}</li>
                <li>{plan.watermark ? "Includes watermark" : "No watermark"}</li>
                <li>
                  {plan.canUseSchoolLogo
                    ? "School logo supported"
                    : "No school logo"}
                </li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="roadmap-section no-print" id="roadmap">
        <div className="section-heading">
          <p className="eyebrow">Roadmap</p>
          <h2>Digital and H5P work comes after the printable foundation.</h2>
          <p>
            H5P remains an advanced future option. MyOwnMaterials should first
            own the content model, publishing rules, templates, and printable
            output.
          </p>
        </div>

        <div className="roadmap-grid">
          {roadmap.map((phase) => (
            <article className="roadmap-card" key={phase.title}>
              <span>{phase.status}</span>
              <h3>{phase.title}</h3>
              <ul>
                {phase.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
