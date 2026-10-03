"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  activityDefinitions,
  canPublishSet,
  getAsset,
  getReusableAssetsForWord,
  type ActivityId,
  type VocabularySet,
} from "@/lib/content";

type ActivityStudioProps = {
  initialSet: VocabularySet;
  initialActivityId?: ActivityId;
  showPicker?: boolean;
};

type CardsPerSheet = 1 | 2 | 3 | 4 | 6 | 8;
type CardLayout = "stacked" | "side" | "text-first" | "image-only";
type ContentKey = "word" | "definition" | "image" | "example" | "qr";
type PrintSides = "front-only" | "double-sided";
type FontStyle = "rounded" | "classic" | "bold";
type Orientation = "portrait" | "landscape";
type SheetSize = "letter" | "a4" | "legal";

type FlashcardSideSettings = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  dottedWord: boolean;
  content: Record<ContentKey, boolean>;
};

const frameColors = ["#f97316", "#2563eb", "#16a34a", "#db2777", "#111827"];
const backgroundColors = ["#ffffff", "#fff7ed", "#fef3c7", "#dcfce7", "#dbeafe", "#fce7f3"];
const textColors = ["#172033", "#1d4ed8", "#166534", "#be123c", "#7c2d12", "#ffffff"];
const cardsPerSheetOptions: CardsPerSheet[] = [1, 2, 3, 4, 6, 8];
const contentOptions: { key: ContentKey; label: string }[] = [
  { key: "word", label: "Word" },
  { key: "definition", label: "Definition" },
  { key: "image", label: "Image" },
  { key: "example", label: "Example sentence" },
  { key: "qr", label: "Audio QR" },
];

const defaultFrontSettings: FlashcardSideSettings = {
  backgroundColor: "#ffffff",
  borderColor: "#f97316",
  borderWidth: 3,
  textColor: "#172033",
  dottedWord: false,
  content: {
    word: true,
    definition: false,
    image: true,
    example: false,
    qr: true,
  },
};

const defaultBackSettings: FlashcardSideSettings = {
  backgroundColor: "#fff7ed",
  borderColor: "#f97316",
  borderWidth: 2,
  textColor: "#172033",
  dottedWord: false,
  content: {
    word: false,
    definition: true,
    image: false,
    example: true,
    qr: true,
  },
};

export function ActivityStudio({
  initialActivityId = "flashcards",
  initialSet,
  showPicker = true,
}: ActivityStudioProps) {
  const [selectedActivityId, setSelectedActivityId] =
    useState<ActivityId>(initialActivityId);
  const [visibility, setVisibility] = useState(initialSet.visibility);
  const [cardsPerSheet, setCardsPerSheet] = useState<CardsPerSheet>(4);
  const [cardLayout, setCardLayout] = useState<CardLayout>("stacked");
  const [printSides, setPrintSides] = useState<PrintSides>("front-only");
  const [fontStyle, setFontStyle] = useState<FontStyle>("rounded");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [sheetSize, setSheetSize] = useState<SheetSize>("letter");
  const [frontSettings, setFrontSettings] =
    useState<FlashcardSideSettings>(defaultFrontSettings);
  const [backSettings, setBackSettings] =
    useState<FlashcardSideSettings>(defaultBackSettings);

  const selectedActivity = activityDefinitions.find(
    (activity) => activity.id === selectedActivityId,
  );
  const isFlashcards = selectedActivityId === "flashcards";

  const publicReady = useMemo(() => canPublishSet(initialSet), [initialSet]);
  const canPublish = visibility === "private" || publicReady;

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

          {isFlashcards ? (
            <FlashcardControls
              backSettings={backSettings}
              cardLayout={cardLayout}
              cardsPerSheet={cardsPerSheet}
              fontStyle={fontStyle}
              frontSettings={frontSettings}
              orientation={orientation}
              printSides={printSides}
              setBackSettings={setBackSettings}
              setCardLayout={setCardLayout}
              setCardsPerSheet={setCardsPerSheet}
              setFontStyle={setFontStyle}
              setFrontSettings={setFrontSettings}
              setOrientation={setOrientation}
              setPrintSides={setPrintSides}
              setSheetSize={setSheetSize}
              sheetSize={sheetSize}
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
              {canPublish ? "Public ready" : "Private only"}
            </span>
          </div>

          {isFlashcards ? (
            <FlashcardPreview
              backSettings={backSettings}
              cardLayout={cardLayout}
              cardsPerSheet={cardsPerSheet}
              fontStyle={fontStyle}
              frontSettings={frontSettings}
              initialSet={initialSet}
              orientation={orientation}
              printSides={printSides}
              sheetSize={sheetSize}
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
  backSettings,
  cardLayout,
  cardsPerSheet,
  fontStyle,
  frontSettings,
  orientation,
  printSides,
  setBackSettings,
  setCardLayout,
  setCardsPerSheet,
  setFontStyle,
  setFrontSettings,
  setOrientation,
  setPrintSides,
  setSheetSize,
  sheetSize,
}: {
  backSettings: FlashcardSideSettings;
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  frontSettings: FlashcardSideSettings;
  orientation: Orientation;
  printSides: PrintSides;
  setBackSettings: (settings: FlashcardSideSettings) => void;
  setCardLayout: (layout: CardLayout) => void;
  setCardsPerSheet: (count: CardsPerSheet) => void;
  setFontStyle: (font: FontStyle) => void;
  setFrontSettings: (settings: FlashcardSideSettings) => void;
  setOrientation: (orientation: Orientation) => void;
  setPrintSides: (sides: PrintSides) => void;
  setSheetSize: (size: SheetSize) => void;
  sheetSize: SheetSize;
}) {
  return (
    <>
      <div className="panel-section">
        <h3>Cards per sheet</h3>
        <div className="segmented six">
          {cardsPerSheetOptions.map((count) => (
            <button
              className={cardsPerSheet === count ? "active" : ""}
              key={count}
              type="button"
              onClick={() => setCardsPerSheet(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Grid layout</h3>
        <div className="layout-grid">
          {([
            ["stacked", "Image above text"],
            ["side", "Image left, text right"],
            ["text-first", "Text above image"],
            ["image-only", "Image focus"],
          ] as [CardLayout, string][]).map(([layout, label]) => (
            <button
              className={cardLayout === layout ? "layout-option active" : "layout-option"}
              key={layout}
              onClick={() => setCardLayout(layout)}
              type="button"
            >
              <span className={`layout-thumb layout-${layout}`}>
                <i />
                <i />
              </span>
              <strong>{label}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Sheet</h3>
        <div className="segmented">
          <button
            className={orientation === "portrait" ? "active" : ""}
            type="button"
            onClick={() => setOrientation("portrait")}
          >
            Portrait
          </button>
          <button
            className={orientation === "landscape" ? "active" : ""}
            type="button"
            onClick={() => setOrientation("landscape")}
          >
            Landscape
          </button>
        </div>
        <div className="sheet-size-list">
          <button
            className={sheetSize === "letter" ? "plan-option active" : "plan-option"}
            onClick={() => setSheetSize("letter")}
            type="button"
          >
            <strong>Letter</strong>
            <small>Default</small>
          </button>
          <LockedOption enabled={false} label="A4" value="Members only" />
          <LockedOption enabled={false} label="Legal" value="Members only" />
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
        <div className="member-note">Upload your own font: Members only</div>
      </div>

      <SideSettingsControls
        label="Front side"
        settings={frontSettings}
        setSettings={setFrontSettings}
      />

      {printSides === "double-sided" ? (
        <SideSettingsControls
          label="Back side"
          settings={backSettings}
          setSettings={setBackSettings}
        />
      ) : null}
    </>
  );
}

function SideSettingsControls({
  label,
  settings,
  setSettings,
}: {
  label: string;
  settings: FlashcardSideSettings;
  setSettings: (settings: FlashcardSideSettings) => void;
}) {
  const updateContent = (key: ContentKey) => {
    setSettings({
      ...settings,
      content: {
        ...settings.content,
        [key]: !settings.content[key],
      },
    });
  };

  return (
    <div className="panel-section side-config">
      <h3>{label}</h3>
      <ColorPalette
        colors={backgroundColors}
        label="Background"
        selectedColor={settings.backgroundColor}
        onSelect={(backgroundColor) => setSettings({ ...settings, backgroundColor })}
      />
      <ColorPalette
        colors={frameColors}
        label="Border"
        selectedColor={settings.borderColor}
        onSelect={(borderColor) => setSettings({ ...settings, borderColor })}
      />
      <ColorPalette
        colors={textColors}
        label="Text"
        selectedColor={settings.textColor}
        onSelect={(textColor) => setSettings({ ...settings, textColor })}
      />
      <label className="range-control">
        <span>Border width: {settings.borderWidth}px</span>
        <input
          max="10"
          min="0"
          onChange={(event) =>
            setSettings({ ...settings, borderWidth: Number(event.target.value) })
          }
          type="range"
          value={settings.borderWidth}
        />
      </label>
      <div className="content-toggle-grid">
        {contentOptions.map((option) => (
          <button
            className={settings.content[option.key] ? "active" : ""}
            key={option.key}
            onClick={() => updateContent(option.key)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        className={settings.dottedWord ? "toggle-row active" : "toggle-row"}
        onClick={() => setSettings({ ...settings, dottedWord: !settings.dottedWord })}
        type="button"
      >
        Dotted tracing word
      </button>
    </div>
  );
}

function ColorPalette({
  colors,
  label,
  onSelect,
  selectedColor,
}: {
  colors: string[];
  label: string;
  onSelect: (color: string) => void;
  selectedColor: string;
}) {
  return (
    <div className="palette-group">
      <span>{label}</span>
      <div className="color-row">
        {colors.map((color) => (
          <button
            aria-label={`Use ${label.toLowerCase()} color ${color}`}
            className={selectedColor === color ? "color-dot active" : "color-dot"}
            key={`${label}-${color}`}
            onClick={() => onSelect(color)}
            style={{ background: color }}
            type="button"
          />
        ))}
      </div>
    </div>
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
  backSettings,
  cardLayout,
  cardsPerSheet,
  fontStyle,
  frontSettings,
  initialSet,
  orientation,
  printSides,
  sheetSize,
}: {
  backSettings: FlashcardSideSettings;
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  frontSettings: FlashcardSideSettings;
  initialSet: VocabularySet;
  orientation: Orientation;
  printSides: PrintSides;
  sheetSize: SheetSize;
}) {
  return (
    <div className="sheet-preview-stack">
      <FlashcardSheet
        cardLayout={cardLayout}
        cardsPerSheet={cardsPerSheet}
        fontStyle={fontStyle}
        initialSet={initialSet}
        orientation={orientation}
        settings={frontSettings}
        sheetLabel="Front side"
        sheetSize={sheetSize}
      />
      {printSides === "double-sided" ? (
        <FlashcardSheet
          cardLayout={cardLayout}
          cardsPerSheet={cardsPerSheet}
          fontStyle={fontStyle}
          initialSet={initialSet}
          mirrorForBack
          orientation={orientation}
          settings={backSettings}
          sheetLabel="Back side"
          sheetSize={sheetSize}
        />
      ) : null}
    </div>
  );
}

function FlashcardSheet({
  cardLayout,
  cardsPerSheet,
  fontStyle,
  initialSet,
  mirrorForBack = false,
  orientation,
  settings,
  sheetLabel,
  sheetSize,
}: {
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  initialSet: VocabularySet;
  mirrorForBack?: boolean;
  orientation: Orientation;
  settings: FlashcardSideSettings;
  sheetLabel: string;
  sheetSize: SheetSize;
}) {
  const previewItems = Array.from({ length: cardsPerSheet }, (_, index) => {
    return initialSet.items[index % initialSet.items.length];
  });
  const orderedItems = mirrorForBack
    ? mirrorItemsByPrintedRow(previewItems, cardsPerSheet)
    : previewItems;

  return (
    <section className={`flashcard-page sheet-${sheetSize} ${orientation}`}>
      <div className="preview-side-label">
        <span>{sheetLabel}</span>
        <small>
          {cardsPerSheet} per sheet · {orientation}
        </small>
      </div>
      <div
        className={`flashcard-sheet cards-${cardsPerSheet} layout-${cardLayout} font-${fontStyle}`}
      >
        {orderedItems.map((item, index) => {
          const asset = getAsset(item.assetId);
          const reusableCount = getReusableAssetsForWord(item.word).length;

          return (
            <article
              className="flashcard"
              key={`${sheetLabel}-${item.id}-${index}`}
              style={
                {
                  "--card-bg": settings.backgroundColor,
                  "--card-border": settings.borderColor,
                  "--card-border-width": `${settings.borderWidth}px`,
                  "--text-color": settings.textColor,
                } as React.CSSProperties
              }
            >
              {settings.content.image && asset ? (
                <div className="flashcard-image-wrap">
                  <Image
                    src={asset.imageUrl}
                    alt={asset.alt}
                    width={640}
                    height={480}
                    style={{ height: "100%", objectFit: "cover", width: "100%" }}
                  />
                </div>
              ) : null}
              <div className="flashcard-body">
                {settings.content.word ? (
                  settings.dottedWord ? (
                    <DottedWord text={item.word} />
                  ) : (
                    <p className="word">{item.word}</p>
                  )
                ) : null}
                {settings.content.definition ? (
                  <p className="definition">{item.definition}</p>
                ) : null}
                {settings.content.example ? (
                  <p className="example">&ldquo;{item.example}&rdquo;</p>
                ) : null}
                {settings.content.qr ? (
                  <div className="qr-row">
                    <span className="qr-code" aria-label={`Audio QR for ${item.word}`} />
                    <small>Scan for audio</small>
                  </div>
                ) : null}
                {settings.content.image ? (
                  <div className="asset-meta">
                    <span>{asset?.licenseStatus ?? "No asset"}</span>
                    <span>{reusableCount} reusable image option(s)</span>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function mirrorItemsByPrintedRow<T>(items: T[], cardsPerSheet: CardsPerSheet) {
  const columnsByCount: Record<CardsPerSheet, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    6: 4,
    8: 4,
  };
  const columns = columnsByCount[cardsPerSheet];
  const mirrored: T[] = [];

  for (let index = 0; index < items.length; index += columns) {
    mirrored.push(...items.slice(index, index + columns).reverse());
  }

  return mirrored;
}

function DottedWord({ text }: { text: string }) {
  return (
    <svg
      aria-label={text}
      className="dotted-word-svg"
      role="img"
      viewBox="0 0 420 90"
    >
      <text
        dominantBaseline="middle"
        fill="none"
        stroke="currentColor"
        strokeDasharray="0.01 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
        textAnchor="middle"
        x="50%"
        y="54%"
      >
        {text}
      </text>
    </svg>
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
