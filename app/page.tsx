import { FlashcardStudio } from "@/components/FlashcardStudio";
import Image from "next/image";
import {
  flashcardTemplates,
  planTiers,
  vocabularyAssets,
  vocabularySets,
} from "@/lib/content";

const printableActivities = [
  "Flashcards",
  "Matching worksheets",
  "Word searches",
  "Bingo cards",
  "Memory cards",
  "Spelling practice",
  "Reading worksheets",
  "Printable quizzes",
];

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
          <a href="#studio">Studio</a>
          <a href="#library">Library</a>
          <a href="#pricing">Plans</a>
          <a href="#roadmap">Roadmap</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Printable-first teaching materials</p>
          <h1>Create your own teaching materials for any classroom.</h1>
          <p>
            Add words, images, texts, and questions once. Turn them into
            beautiful printable resources without needing design skills.
          </p>
          <div className="hero-actions no-print">
            <a className="primary-link" href="#studio">
              Start with flashcards
            </a>
            <a className="secondary-link" href="#roadmap">
              See the roadmap
            </a>
          </div>
        </div>

        <div className="hero-card no-print" aria-label="Product flow">
          <span>Add content</span>
          <strong>Vocabulary set</strong>
          <span>Choose activity</span>
          <strong>Flashcards</strong>
          <span>Pick template</span>
          <strong>Print-ready PDF</strong>
        </div>
      </section>

      <section className="feature-band no-print" aria-label="Printable activities">
        {printableActivities.map((activity) => (
          <span key={activity}>{activity}</span>
        ))}
      </section>

      <FlashcardStudio initialSet={vocabularySet} />

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
          <p className="eyebrow">Templates</p>
          <h2>Design help for teachers who already have great content.</h2>
        </div>
        <div className="card-grid">
          {flashcardTemplates.map((template) => (
            <article className="info-card" key={template.id}>
              <span
                aria-hidden="true"
                className="template-dot"
                style={{ background: template.accent }}
              />
              <h3>{template.name}</h3>
              <p>{template.description}</p>
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
