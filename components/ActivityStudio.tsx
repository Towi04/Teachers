"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  activityDefinitions,
  canPublishSet,
  getAsset,
  getReusableAssetsForWord,
  planTiers,
  type ActivityId,
  type PlanTier,
  type VocabularySet,
} from "@/lib/content";

type ActivityStudioProps = {
  initialSet: VocabularySet;
  initialActivityId?: ActivityId;
  showPicker?: boolean;
};

type CardSize = "small" | "medium" | "large";
type PrintSides = "front-only" | "double-sided";
type FontStyle = "rounded" | "classic" | "bold";

const frameColors = ["#f97316", "#2563eb", "#16a34a", "#db2777", "#111827"];

export function ActivityStudio({
  initialActivityId = "flashcards",
  initialSet,
  showPicker = true,
}: ActivityStudioProps) {
  const [selectedActivityId, setSelectedActivityId] =
    useState<ActivityId>(initialActivityId);
  const [selectedPlanId, setSelectedPlanId] =
    useState<PlanTier["id"]>("free");
  const [visibility, setVisibility] = useState(initialSet.visibility);
  const [cardSize, setCardSize] = useState<CardSize>("medium");
  const [frameColor, setFrameColor] = useState(frameColors[0]);
  const [includeImages, setIncludeImages] = useState(true);
  const [printSides, setPrintSides] = useState<PrintSides>("front-only");
  const [fontStyle, setFontStyle] = useState<FontStyle>("rounded");

  const selectedActivity = activityDefinitions.find(
    (activity) => activity.id === selectedActivityId,
  );
  const selectedPlan = planTiers.find((plan) => plan.id === selectedPlanId);
  const isFlashcards = selectedActivityId === "flashcards";

  const publicReady = useMemo(() => canPublishSet(initialSet), [initialSet]);
  const canPublish = visibility === "private" || publicReady;
  const memberPlan = selectedPlanId === "premium" || selectedPlanId === "school";

  return (
    <section className="activity-studio" id="create">
      {showPicker ? (
        <>
          <div className="section-heading">
            <p className="eyebrow">Create materials</p>
            <h2>Choose what you want to create.</h2>
            <p>
              Start from the activity you need. Each card will open its own
              configuration panel, so teachers do not have to hunt through one
              large editor.
            </p>
          </div>

          <div className="activity-picker no-print">
            {activityDefinitions.map((activity) => (
              <button
                className={
                  selectedActivityId === activity.id
                    ? "activity-card active"
                    : "activity-card"
                }
                key={activity.id}
                onClick={() => setSelectedActivityId(activity.id)}
                style={
                  { "--activity-accent": activity.accent } as React.CSSProperties
                }
                type="button"
              >
                <span className="tool-icon">{activity.icon}</span>
                <span className={`activity-status status-${activity.status}`}>
                  {activity.status === "available"
                    ? "Available"
                    : activity.status === "next"
                      ? "Next"
                      : "Planned"}
                </span>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <div>
                  <small>{activity.inputType}</small>
                  <small>{activity.outputType}</small>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="config-header no-print">
          <form action="/">
            <button className="back-link" type="submit">
              Back to all tools
            </button>
          </form>
          <p className="eyebrow">Configure activity</p>
          <h1>{selectedActivity?.title}</h1>
          <p>{selectedActivity?.description}</p>
        </div>
      )}

      <div className="studio-grid">
        <aside
          className="control-panel no-print"
          aria-label={`${selectedActivity?.title ?? "Activity"} settings`}
        >
          <div className="panel-section">
            <h3>Content source</h3>
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
            <h3>Visibility</h3>
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
                ? "Private materials can include teacher-uploaded images under the teacher's responsibility."
                : publicReady
                  ? "This content can be public and earn credits."
                  : "This content includes assets that need review before public publishing."}
            </p>
          </div>

          <div className="panel-section">
            <h3>Plan preview</h3>
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
                  <small>{plan.watermark ? "Watermarked" : "No watermark"}</small>
                </button>
              ))}
            </div>
          </div>

          {isFlashcards ? (
            <FlashcardControls
              cardSize={cardSize}
              frameColor={frameColor}
              fontStyle={fontStyle}
              includeImages={includeImages}
              memberPlan={memberPlan}
              printSides={printSides}
              setCardSize={setCardSize}
              setFontStyle={setFontStyle}
              setFrameColor={setFrameColor}
              setIncludeImages={setIncludeImages}
              setPrintSides={setPrintSides}
            />
          ) : (
            <PlannedActivityControls activityId={selectedActivityId} />
          )}

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
              <h3>{selectedActivity?.title}</h3>
            </div>
            <span className={canPublish ? "status-pill" : "status-pill warning"}>
              {canPublish ? "Publish rules satisfied" : "Private only"}
            </span>
          </div>

          {isFlashcards ? (
            <FlashcardPreview
              cardSize={cardSize}
              fontStyle={fontStyle}
              frameColor={frameColor}
              includeImages={includeImages}
              initialSet={initialSet}
              memberPlan={memberPlan}
              printSides={printSides}
              showWatermark={selectedPlan?.watermark ?? true}
            />
          ) : (
            <PlannedActivityPreview activityId={selectedActivityId} />
          )}
        </div>
      </div>
    </section>
  );
}

function FlashcardControls({
  cardSize,
  frameColor,
  fontStyle,
  includeImages,
  memberPlan,
  printSides,
  setCardSize,
  setFontStyle,
  setFrameColor,
  setIncludeImages,
  setPrintSides,
}: {
  cardSize: CardSize;
  frameColor: string;
  fontStyle: FontStyle;
  includeImages: boolean;
  memberPlan: boolean;
  printSides: PrintSides;
  setCardSize: (size: CardSize) => void;
  setFontStyle: (font: FontStyle) => void;
  setFrameColor: (color: string) => void;
  setIncludeImages: (include: boolean) => void;
  setPrintSides: (sides: PrintSides) => void;
}) {
  return (
    <>
      <div className="panel-section">
        <h3>Flashcard size</h3>
        <div className="segmented three">
          {(["small", "medium", "large"] as CardSize[]).map((size) => (
            <button
              className={cardSize === size ? "active" : ""}
              key={size}
              type="button"
              onClick={() => setCardSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Frame color</h3>
        <div className="color-row">
          {frameColors.map((color) => (
            <button
              aria-label={`Use frame color ${color}`}
              className={frameColor === color ? "color-dot active" : "color-dot"}
              key={color}
              onClick={() => setFrameColor(color)}
              style={{ background: color }}
              type="button"
            />
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Images</h3>
        <div className="segmented">
          <button
            className={includeImages ? "active" : ""}
            type="button"
            onClick={() => setIncludeImages(true)}
          >
            Include
          </button>
          <button
            className={!includeImages ? "active" : ""}
            type="button"
            onClick={() => setIncludeImages(false)}
          >
            Text only
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Print sides</h3>
        <div className="segmented">
          <button
            className={printSides === "front-only" ? "active" : ""}
            type="button"
            onClick={() => setPrintSides("front-only")}
          >
            Front only
          </button>
          <button
            className={printSides === "double-sided" ? "active" : ""}
            type="button"
            onClick={() => setPrintSides("double-sided")}
          >
            Front + back
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Font style</h3>
        <div className="segmented three">
          {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
            <button
              className={fontStyle === font ? "active" : ""}
              key={font}
              type="button"
              onClick={() => setFontStyle(font)}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section premium-panel">
        <h3>Premium options</h3>
        <LockedOption
          enabled={memberPlan}
          label="Add school logo"
          value="Members only"
        />
        <LockedOption
          enabled={memberPlan}
          label="Remove MyOwnMaterials watermark"
          value="Members only"
        />
      </div>
    </>
  );
}

function LockedOption({
  enabled,
  label,
  value,
}: {
  enabled: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className={enabled ? "locked-option unlocked" : "locked-option"}>
      <span>{label}</span>
      <strong>{enabled ? "Unlocked" : value}</strong>
    </div>
  );
}

function PlannedActivityControls({ activityId }: { activityId: ActivityId }) {
  const activity = activityDefinitions.find((item) => item.id === activityId);

  return (
    <div className="panel-section">
      <h3>{activity?.title} settings</h3>
      <p className="policy-note">
        This activity card is part of the printable roadmap. These controls are
        placeholders so we can configure each activity one by one.
      </p>
      <div className="planned-options">
        {activity?.configurationHighlights.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    </div>
  );
}

function FlashcardPreview({
  cardSize,
  fontStyle,
  frameColor,
  includeImages,
  initialSet,
  memberPlan,
  printSides,
  showWatermark,
}: {
  cardSize: CardSize;
  fontStyle: FontStyle;
  frameColor: string;
  includeImages: boolean;
  initialSet: VocabularySet;
  memberPlan: boolean;
  printSides: PrintSides;
  showWatermark: boolean;
}) {
  return (
    <div
      className={`flashcard-sheet size-${cardSize} font-${fontStyle} ${
        includeImages ? "" : "text-only"
      } ${printSides === "double-sided" ? "double-sided" : ""}`}
      style={{ "--accent": frameColor } as React.CSSProperties}
    >
      {initialSet.items.map((item) => {
        const asset = getAsset(item.assetId);
        const reusableCount = getReusableAssetsForWord(item.word).length;

        return (
          <article className="flashcard" key={item.id}>
            {showWatermark ? <span className="watermark">MyOwnMaterials</span> : null}
            {memberPlan ? <span className="school-logo">School logo</span> : null}
            {includeImages && asset ? (
              <div className="flashcard-image-wrap">
                <Image src={asset.imageUrl} alt={asset.alt} width={640} height={480} />
              </div>
            ) : null}
            <div className="flashcard-body">
              <div>
                <p className="word">{item.word}</p>
                <p className="definition">{item.definition}</p>
              </div>
              <p className="example">&ldquo;{item.example}&rdquo;</p>
              <div className="asset-meta">
                <span>{printSides === "double-sided" ? "front + back" : "front only"}</span>
                <span>{asset?.licenseStatus ?? "No asset"}</span>
                <span>{reusableCount} reusable image option(s)</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PlannedActivityPreview({ activityId }: { activityId: ActivityId }) {
  const activity = activityDefinitions.find((item) => item.id === activityId);

  return (
    <div
      className="planned-preview"
      style={{ "--activity-accent": activity?.accent } as React.CSSProperties}
    >
      <span className="activity-status status-planned">Configuration coming next</span>
      <h3>{activity?.title}</h3>
      <p>{activity?.description}</p>
      <div className="planned-preview-grid">
        {activity?.configurationHighlights.map((option) => (
          <div key={option}>
            <small>Option</small>
            <strong>{option}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
