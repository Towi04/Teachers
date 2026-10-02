"use client";

import { useMemo, useState } from "react";
import {
  canPublishSet,
  flashcardTemplates,
  getAsset,
  getReusableAssetsForWord,
  planTiers,
  type PlanTier,
  type TemplateId,
  type VocabularySet,
} from "@/lib/content";
import Image from "next/image";

type FlashcardStudioProps = {
  initialSet: VocabularySet;
};

export function FlashcardStudio({ initialSet }: FlashcardStudioProps) {
  const [selectedTemplateId, setSelectedTemplateId] =
    useState<TemplateId>("playful");
  const [selectedPlanId, setSelectedPlanId] =
    useState<PlanTier["id"]>("free");
  const [visibility, setVisibility] = useState(initialSet.visibility);

  const selectedTemplate = flashcardTemplates.find(
    (template) => template.id === selectedTemplateId,
  );
  const selectedPlan = planTiers.find((plan) => plan.id === selectedPlanId);

  const publicReady = useMemo(() => canPublishSet(initialSet), [initialSet]);
  const canPublish = visibility === "private" || publicReady;

  return (
    <section className="studio" id="studio">
      <div className="section-heading">
        <p className="eyebrow">Printable MVP</p>
        <h2>Build once. Print many classroom-ready cards.</h2>
        <p>
          This first studio turns a reusable vocabulary set into printable
          flashcards. The same content model can later power worksheets, word
          searches, quizzes, and digital activities.
        </p>
      </div>

      <div className="studio-grid">
        <aside className="control-panel no-print" aria-label="Flashcard settings">
          <div className="panel-section">
            <h3>1. Content collection</h3>
            <div className="content-card">
              <span>{initialSet.subject}</span>
              <strong>{initialSet.title}</strong>
              <small>
                {initialSet.language} · {initialSet.gradeBand} ·{" "}
                {initialSet.items.length} words
              </small>
            </div>
          </div>

          <div className="panel-section">
            <h3>2. Visibility</h3>
            <div className="segmented">
              <button
                className={visibility === "private" ? "active" : ""}
                type="button"
                onClick={() => setVisibility("private")}
              >
                Private
              </button>
              <button
                className={visibility === "public" ? "active" : ""}
                type="button"
                onClick={() => setVisibility("public")}
              >
                Public
              </button>
            </div>
            <p className={canPublish ? "policy-note" : "policy-note warning"}>
              {visibility === "private"
                ? "Private materials may include teacher-uploaded images under the teacher's responsibility."
                : publicReady
                  ? "This set only uses reusable or platform-approved assets, so it can earn public credits."
                  : "This set includes an asset that needs review before it can become public or earn credits."}
            </p>
          </div>

          <div className="panel-section">
            <h3>3. Template</h3>
            <div className="template-list">
              {flashcardTemplates.map((template) => (
                <button
                  className={
                    selectedTemplateId === template.id
                      ? "template-option active"
                      : "template-option"
                  }
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(template.id)}
                >
                  <span
                    aria-hidden="true"
                    className="template-dot"
                    style={{ background: template.accent }}
                  />
                  <strong>{template.name}</strong>
                  <small>{template.description}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h3>4. Plan behavior</h3>
            <div className="plan-list">
              {planTiers.map((plan) => (
                <button
                  className={
                    selectedPlanId === plan.id ? "plan-option active" : "plan-option"
                  }
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                >
                  <strong>{plan.name}</strong>
                  <small>{plan.watermark ? "Watermarked PDF" : "No watermark"}</small>
                </button>
              ))}
            </div>
          </div>

          <button
            className="primary-action"
            type="button"
            onClick={() => window.print()}
          >
            Print or save PDF
          </button>
        </aside>

        <div className="preview-area">
          <div className="preview-toolbar no-print">
            <div>
              <p className="eyebrow">Preview</p>
              <h3>
                {selectedTemplate?.name} · {selectedPlan?.name}
              </h3>
            </div>
            <span className={canPublish ? "status-pill" : "status-pill warning"}>
              {canPublish ? "Publish rules satisfied" : "Private only"}
            </span>
          </div>

          <div
            className={`flashcard-sheet template-${selectedTemplateId}`}
            style={{ "--accent": selectedTemplate?.accent } as React.CSSProperties}
          >
            {initialSet.items.map((item) => {
              const asset = getAsset(item.assetId);
              const reusableCount = getReusableAssetsForWord(item.word).length;

              return (
                <article className="flashcard" key={item.id}>
                  {selectedPlan?.watermark ? (
                    <span className="watermark">MyOwnMaterials</span>
                  ) : null}
                  <div className="flashcard-image-wrap">
                    {asset ? (
                      <Image
                        src={asset.imageUrl}
                        alt={asset.alt}
                        width={640}
                        height={480}
                      />
                    ) : null}
                  </div>
                  <div className="flashcard-body">
                    <div>
                      <p className="word">{item.word}</p>
                      <p className="definition">{item.definition}</p>
                    </div>
                    <p className="example">&ldquo;{item.example}&rdquo;</p>
                    <div className="asset-meta">
                      <span>{asset?.licenseStatus ?? "No asset"}</span>
                      <span>{reusableCount} reusable image option(s)</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
