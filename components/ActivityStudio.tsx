"use client";

import Image from "next/image";
import { type ChangeEvent, useMemo, useState } from "react";
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
type ContentKey = "word" | "definition" | "translation" | "image" | "example" | "qr";
type PrintSides = "front-only" | "double-sided";
type FontStyle = "rounded" | "classic" | "bold";
type Orientation = "portrait" | "landscape";
type SheetSize = "letter" | "a4" | "legal";
type CrosswordTab = "title" | "words" | "puzzle" | "design" | "page" | "answer";
type CrosswordDirection = "across" | "down";
type CrosswordCluePlacement = "beside" | "below";
type CrosswordNumbering = "position" | "entry-order";
type CrosswordDensity = "compact" | "comfortable" | "large";

type CrosswordEntry = {
  id: string;
  word: string;
  clue: string;
};

type CrosswordDesignSettings = {
  backgroundColor: string;
  cellColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  fontStyle: FontStyle;
  density: CrosswordDensity;
};

type CrosswordPlacement = CrosswordEntry & {
  cleanWord: string;
  row: number;
  col: number;
  direction: CrosswordDirection;
  number: number;
};

type CrosswordBuildResult = {
  grid: (string | null)[][];
  placements: CrosswordPlacement[];
  skipped: CrosswordEntry[];
  numbers: Map<string, number>;
};
type WordSearchDifficulty = "easy" | "standard" | "challenge";
type WordSearchDirection = "horizontal" | "vertical" | "diagonal" | "backwards";
type WordSearchLetterCase = "uppercase" | "lowercase";
type WordSearchHighlightStyle = "marker" | "circle" | "underline";
type BingoBoardSize = 3 | 4 | 5;
type BingoDisplayMode = "words" | "images" | "both";
type BingoCardsPerPage = 1 | 2 | 4;
type MatchingTab = "title" | "pairs" | "match-type" | "design" | "page" | "answer-key";
type MatchingMode =
  | "word-definition"
  | "image-word"
  | "word-translation"
  | "sentence-word"
  | "mixed";
type MatchingColumns = "one" | "two" | "three";
type MatchingOutputStyle = "worksheet-lines" | "cut-out-cards";
type MatchingLineStyle = "solid" | "dashed" | "dotted";
type MatchingSpacing = "compact" | "comfortable" | "wide";
type MemoryTab = "title" | "pairs" | "faces" | "back" | "page" | "answer";
type MemoryPairType =
  | "word-image"
  | "word-definition"
  | "word-translation"
  | "image-definition"
  | "custom";
type MemoryCardSize = "small" | "medium" | "large";
type MemoryCardsPerPage = 4 | 6 | 8 | 12;
type MemoryBackPattern = "stars" | "dots" | "stripes" | "blank";
type MemoryCornerStyle = "rounded" | "square";
type MemoryDuplicateMode = "single" | "double";
type MemoryFaceKind = "word" | "image" | "definition" | "translation" | "custom";

type FlashcardSideSettings = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  dottedWord: boolean;
  content: Record<ContentKey, boolean>;
};

type EditableVocabularyItem = {
  id: string;
  word: string;
  definition: string;
  example: string;
  translation: string;
  assetId: string;
};

type WordSearchSettings = {
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  difficulty: WordSearchDifficulty;
  directions: Record<WordSearchDirection, boolean>;
  fontStyle: FontStyle;
  gridSize: number;
  highlightStyle: WordSearchHighlightStyle;
  includeAnswerKey: boolean;
  includePictureHints: boolean;
  instructions: string;
  letterCase: WordSearchLetterCase;
  orientation: Orientation;
  sheetSize: SheetSize;
  showWordBank: boolean;
  textColor: string;
};

type WordSearchCell = {
  col: number;
  isAnswer: boolean;
  letter: string;
  row: number;
};

type WordSearchPuzzle = {
  cells: WordSearchCell[][];
  placedWords: string[];
  skippedWords: string[];
};

type BingoSettings = {
  accentColor: string;
  backgroundColor: string;
  boardCount: number;
  boardSize: BingoBoardSize;
  borderColor: string;
  cardsPerPage: BingoCardsPerPage;
  cutLines: boolean;
  displayMode: BingoDisplayMode;
  fontStyle: FontStyle;
  footerInstructions: string;
  freeSpace: boolean;
  freeSpaceLabel: string;
  headerInstructions: string;
  includeCallerCards: boolean;
  includeCallList: boolean;
  orientation: Orientation;
  randomizeBoards: boolean;
  sheetSize: SheetSize;
  showItemBank: boolean;
  textColor: string;
  title: string;
};

type BingoBoardCell = {
  assetId: string;
  id: string;
  isFree: boolean;
  label: string;
  subLabel: string;
};

type MatchingPair = {
  id: string;
  word: string;
  definition: string;
  translation: string;
  sentence: string;
  assetId: string;
};

type MatchingSettings = {
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  columns: MatchingColumns;
  fontStyle: FontStyle;
  includeImages: boolean;
  includeNumbering: boolean;
  instructions: string;
  lineStyle: MatchingLineStyle;
  matchMode: MatchingMode;
  orientation: Orientation;
  outputStyle: MatchingOutputStyle;
  pairsPerPage: number;
  sheetSize: SheetSize;
  showAnswerKey: boolean;
  shuffleLeft: boolean;
  shuffleRight: boolean;
  spacing: MatchingSpacing;
  textColor: string;
};

type MemoryPair = {
  id: string;
  word: string;
  definition: string;
  translation: string;
  customLeft: string;
  customRight: string;
  assetId: string;
};

type MemorySettings = {
  backColor: string;
  backPattern: MemoryBackPattern;
  backPatternColor: string;
  borderColor: string;
  cardSize: MemoryCardSize;
  cardsPerPage: MemoryCardsPerPage;
  cornerStyle: MemoryCornerStyle;
  cutLines: boolean;
  duplicateMode: MemoryDuplicateMode;
  fontStyle: FontStyle;
  frontBackgroundColor: string;
  instructions: string;
  orientation: Orientation;
  pairType: MemoryPairType;
  sheetSize: SheetSize;
  showBackLogo: boolean;
  showPairLabels: boolean;
  showTeacherGuide: boolean;
  shuffleCards: boolean;
  textColor: string;
  title: string;
};

type MemoryCardPreviewItem = {
  assetId: string;
  content: string;
  faceLabel: string;
  id: string;
  kind: MemoryFaceKind;
  pairLabel: string;
  subContent: string;
};

type QuizQuestionType = "multiple-choice" | "true-false" | "short-answer";
type QuizNumberingStyle = "numbers" | "letters" | "none";
type QuizQuestionSpacing = "compact" | "comfortable" | "wide";

type QuizQuestion = {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  choices: string[];
  correctAnswer: string;
  points: number;
};

type QuizSettings = {
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  fontStyle: FontStyle;
  instructions: string;
  numberingStyle: QuizNumberingStyle;
  orientation: Orientation;
  questionSpacing: QuizQuestionSpacing;
  randomizeOptions: boolean;
  randomizeQuestions: boolean;
  sheetSize: SheetSize;
  showAnswerKey: boolean;
  showScoreBoxes: boolean;
  textColor: string;
  writtenAnswerLines: number;
};

const frameColors = ["#f97316", "#2563eb", "#16a34a", "#db2777", "#111827"];
const backgroundColors = ["#ffffff", "#fff7ed", "#fef3c7", "#dcfce7", "#dbeafe", "#fce7f3"];
const textColors = ["#172033", "#1d4ed8", "#166534", "#be123c", "#7c2d12", "#ffffff"];
const crosswordAccentColors = ["#7c3aed", "#2563eb", "#0891b2", "#16a34a", "#db2777", "#111827"];
const crosswordCellColors = ["#ffffff", "#f8fafc", "#fff7ed", "#fef3c7", "#eef2ff", "#fce7f3"];
const cardsPerSheetOptions: CardsPerSheet[] = [1, 2, 3, 4, 6, 8];
const bingoBoardSizes: BingoBoardSize[] = [3, 4, 5];
const bingoCardsPerPageOptions: BingoCardsPerPage[] = [1, 2, 4];
const bingoDisplayModeOptions: { key: BingoDisplayMode; label: string }[] = [
  { key: "words", label: "Words" },
  { key: "images", label: "Images" },
  { key: "both", label: "Words + images" },
];
const wordSearchGridSizes = [8, 10, 12, 15];
const wordSearchDirectionOptions: { key: WordSearchDirection; label: string }[] = [
  { key: "horizontal", label: "Horizontal" },
  { key: "vertical", label: "Vertical" },
  { key: "diagonal", label: "Diagonal" },
  { key: "backwards", label: "Backwards" },
];
const wordSearchDifficultyOptions: {
  key: WordSearchDifficulty;
  label: string;
  description: string;
}[] = [
  { key: "easy", label: "Easy", description: "8 x 8, forward words" },
  { key: "standard", label: "Standard", description: "10 x 10 with diagonals" },
  { key: "challenge", label: "Challenge", description: "12 x 12 with backwards words" },
];
const wordSearchHighlightOptions: {
  key: WordSearchHighlightStyle;
  label: string;
}[] = [
  { key: "marker", label: "Marker" },
  { key: "circle", label: "Circle" },
  { key: "underline", label: "Underline" },
];
const quizQuestionTypeOptions: {
  key: QuizQuestionType;
  label: string;
}[] = [
  { key: "multiple-choice", label: "Multiple choice" },
  { key: "true-false", label: "True/false" },
  { key: "short-answer", label: "Short answer" },
];
const quizNumberingOptions: {
  key: QuizNumberingStyle;
  label: string;
}[] = [
  { key: "numbers", label: "1, 2, 3" },
  { key: "letters", label: "A, B, C" },
  { key: "none", label: "None" },
];
const quizSpacingOptions: {
  key: QuizQuestionSpacing;
  label: string;
}[] = [
  { key: "compact", label: "Compact" },
  { key: "comfortable", label: "Comfortable" },
  { key: "wide", label: "Wide" },
];
const matchingModeOptions: {
  key: MatchingMode;
  label: string;
  description: string;
}[] = [
  {
    key: "word-definition",
    label: "Word + definition",
    description: "Students connect each vocabulary word to its meaning.",
  },
  {
    key: "image-word",
    label: "Image + word",
    description: "Students match picture cards with vocabulary words.",
  },
  {
    key: "word-translation",
    label: "Word + translation",
    description: "Use the right column for another language or synonym.",
  },
  {
    key: "sentence-word",
    label: "Sentence + word",
    description: "Students choose the word that matches each sentence.",
  },
  {
    key: "mixed",
    label: "Mixed",
    description: "Rotate definitions, images, translations, and sentences.",
  },
];
const matchingLineStyleOptions: { key: MatchingLineStyle; label: string }[] = [
  { key: "solid", label: "Solid" },
  { key: "dashed", label: "Dashed" },
  { key: "dotted", label: "Dotted" },
];
const matchingSpacingOptions: { key: MatchingSpacing; label: string }[] = [
  { key: "compact", label: "Compact" },
  { key: "comfortable", label: "Comfortable" },
  { key: "wide", label: "Wide" },
];
const matchingPairsPerPageOptions = [4, 6, 8, 10, 12];
const memoryPairTypeOptions: {
  key: MemoryPairType;
  label: string;
  description: string;
}[] = [
  {
    key: "word-image",
    label: "Word + image",
    description: "One card shows the vocabulary word; its match shows the picture.",
  },
  {
    key: "word-definition",
    label: "Word + definition",
    description: "Students match each word with the meaning.",
  },
  {
    key: "word-translation",
    label: "Word + translation",
    description: "Use translations or synonyms as the matching face.",
  },
  {
    key: "image-definition",
    label: "Image + definition",
    description: "Pair visual prompts with definitions.",
  },
  {
    key: "custom",
    label: "Custom pair",
    description: "Use the custom left and right text columns.",
  },
];
const memoryCardsPerPageOptions: MemoryCardsPerPage[] = [4, 6, 8, 12];
const memoryCardSizeOptions: { key: MemoryCardSize; label: string }[] = [
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
];
const memoryBackPatternOptions: { key: MemoryBackPattern; label: string }[] = [
  { key: "stars", label: "Stars" },
  { key: "dots", label: "Dots" },
  { key: "stripes", label: "Stripes" },
  { key: "blank", label: "Blank" },
];
const contentOptions: { key: ContentKey; label: string }[] = [
  { key: "word", label: "Word" },
  { key: "definition", label: "Definition" },
  { key: "translation", label: "Translation" },
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
    translation: false,
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
    translation: true,
    image: false,
    example: true,
    qr: true,
  },
};

const defaultWordSearchSettings: WordSearchSettings = {
  accentColor: "#0891b2",
  backgroundColor: "#ffffff",
  borderColor: "#0891b2",
  difficulty: "standard",
  directions: {
    horizontal: true,
    vertical: true,
    diagonal: true,
    backwards: false,
  },
  fontStyle: "rounded",
  gridSize: 10,
  highlightStyle: "marker",
  includeAnswerKey: true,
  includePictureHints: false,
  instructions: "Find each hidden word in the puzzle. Circle the words as you find them.",
  letterCase: "uppercase",
  orientation: "portrait",
  sheetSize: "letter",
  showWordBank: true,
  textColor: "#172033",
};

function buildDefaultBingoSettings(title: string): BingoSettings {
  return {
    accentColor: "#db2777",
    backgroundColor: "#ffffff",
    boardCount: 12,
    boardSize: 5,
    borderColor: "#db2777",
    cardsPerPage: 2,
    cutLines: true,
    displayMode: "words",
    fontStyle: "rounded",
    footerInstructions: "Call each item once. Students mark a square when they hear it.",
    freeSpace: true,
    freeSpaceLabel: "FREE",
    headerInstructions: "Listen carefully and mark the matching square.",
    includeCallerCards: true,
    includeCallList: true,
    orientation: "portrait",
    randomizeBoards: true,
    sheetSize: "letter",
    showItemBank: true,
    textColor: "#172033",
    title: `${title} Bingo`,
  };
}

const defaultMatchingSettings: MatchingSettings = {
  accentColor: "#16a34a",
  backgroundColor: "#ffffff",
  borderColor: "#16a34a",
  columns: "two",
  fontStyle: "rounded",
  includeImages: true,
  includeNumbering: true,
  instructions: "Draw a line to match each item on the left with the correct item on the right.",
  lineStyle: "dashed",
  matchMode: "word-definition",
  orientation: "portrait",
  outputStyle: "worksheet-lines",
  pairsPerPage: 8,
  sheetSize: "letter",
  showAnswerKey: true,
  shuffleLeft: false,
  shuffleRight: true,
  spacing: "comfortable",
  textColor: "#172033",
};

function buildDefaultMemorySettings(title: string): MemorySettings {
  return {
    backColor: "#ca8a04",
    backPattern: "stars",
    backPatternColor: "#fef3c7",
    borderColor: "#ca8a04",
    cardSize: "medium",
    cardsPerPage: 8,
    cornerStyle: "rounded",
    cutLines: true,
    duplicateMode: "single",
    fontStyle: "rounded",
    frontBackgroundColor: "#ffffff",
    instructions: "Place all cards face down. Turn over two cards and keep the pair if they match.",
    orientation: "portrait",
    pairType: "word-definition",
    sheetSize: "letter",
    showBackLogo: true,
    showPairLabels: false,
    showTeacherGuide: true,
    shuffleCards: true,
    textColor: "#172033",
    title: `${title} Memory Cards`,
  };
}

const defaultQuizSettings: QuizSettings = {
  accentColor: "#475569",
  backgroundColor: "#ffffff",
  borderColor: "#cbd5e1",
  fontStyle: "rounded",
  instructions: "Answer each question. Show your best thinking for written responses.",
  numberingStyle: "numbers",
  orientation: "portrait",
  questionSpacing: "comfortable",
  randomizeOptions: false,
  randomizeQuestions: false,
  sheetSize: "letter",
  showAnswerKey: true,
  showScoreBoxes: true,
  textColor: "#172033",
  writtenAnswerLines: 3,
};

export function ActivityStudio({
  initialActivityId = "flashcards",
  initialSet,
  showPicker = true,
}: ActivityStudioProps) {
  const [selectedActivityId, setSelectedActivityId] =
    useState<ActivityId>(initialActivityId);
  const [visibility, setVisibility] = useState(initialSet.visibility);
  const [materialTitle, setMaterialTitle] = useState(initialSet.title);
  const [items, setItems] = useState<EditableVocabularyItem[]>(() =>
    initialSet.items.map((item) => ({
      ...item,
      translation: "",
    })),
  );
  const [bulkText, setBulkText] = useState(
    initialSet.items
      .map((item) => `${item.word},${item.definition},${item.example},`)
      .join("\n"),
  );
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
  const [crosswordTitle, setCrosswordTitle] = useState(`${initialSet.title} Crossword`);
  const [crosswordInstructions, setCrosswordInstructions] = useState(
    "Use the clues to complete the crossword.",
  );
  const [crosswordEntries, setCrosswordEntries] = useState<CrosswordEntry[]>(() =>
    initialSet.items.map((item) => ({
      id: `crossword-${item.id}`,
      word: item.word,
      clue: item.definition,
    })),
  );
  const [crosswordBulkText, setCrosswordBulkText] = useState(
    initialSet.items.map((item) => `${item.word},${item.definition}`).join("\n"),
  );
  const [crosswordGridSize, setCrosswordGridSize] = useState(11);
  const [crosswordNumbering, setCrosswordNumbering] =
    useState<CrosswordNumbering>("position");
  const [showCrosswordWordBank, setShowCrosswordWordBank] = useState(true);
  const [includeCrosswordAnswerKey, setIncludeCrosswordAnswerKey] = useState(true);
  const [crosswordCluePlacement, setCrosswordCluePlacement] =
    useState<CrosswordCluePlacement>("beside");
  const [crosswordUppercase, setCrosswordUppercase] = useState(true);
  const [crosswordOrientation, setCrosswordOrientation] =
    useState<Orientation>("portrait");
  const [crosswordSheetSize, setCrosswordSheetSize] = useState<SheetSize>("letter");
  const [crosswordDesign, setCrosswordDesign] = useState<CrosswordDesignSettings>({
    backgroundColor: "#ffffff",
    cellColor: "#ffffff",
    borderColor: "#172033",
    textColor: "#172033",
    accentColor: "#7c3aed",
    fontStyle: "rounded",
    density: "comfortable",
  });
  const [wordSearchBulkText, setWordSearchBulkText] = useState(
    initialSet.items.map((item) => `${item.word},${item.definition}`).join("\n"),
  );
  const [wordSearchSettings, setWordSearchSettings] = useState<WordSearchSettings>(
    defaultWordSearchSettings,
  );
  const [bingoBulkText, setBingoBulkText] = useState(
    initialSet.items.map((item) => `${item.word},${item.definition}`).join("\n"),
  );
  const [bingoSettings, setBingoSettings] = useState<BingoSettings>(() =>
    buildDefaultBingoSettings(initialSet.title),
  );
  const [matchingTitle, setMatchingTitle] = useState(`${initialSet.title} Matching`);
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>(() =>
    initialSet.items.map((item) => ({
      id: `matching-${item.id}`,
      word: item.word,
      definition: item.definition,
      translation: "",
      sentence: item.example,
      assetId: item.assetId,
    })),
  );
  const [matchingBulkText, setMatchingBulkText] = useState(
    initialSet.items
      .map((item) => `${item.word},${item.definition},,${item.example},${item.assetId}`)
      .join("\n"),
  );
  const [matchingSettings, setMatchingSettings] = useState<MatchingSettings>(
    defaultMatchingSettings,
  );
  const [memoryPairs, setMemoryPairs] = useState<MemoryPair[]>(() =>
    initialSet.items.map((item) => ({
      id: `memory-${item.id}`,
      word: item.word,
      definition: item.definition,
      translation: "",
      customLeft: item.word,
      customRight: item.definition,
      assetId: item.assetId,
    })),
  );
  const [memoryBulkText, setMemoryBulkText] = useState(
    initialSet.items
      .map((item) => `${item.word},${item.definition},,${item.word},${item.definition},${item.assetId}`)
      .join("\n"),
  );
  const [memorySettings, setMemorySettings] = useState<MemorySettings>(() =>
    buildDefaultMemorySettings(initialSet.title),
  );
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    buildDefaultQuizQuestions(initialSet.items),
  );
  const [quizBulkText, setQuizBulkText] = useState(() =>
    buildQuizBulkText(buildDefaultQuizQuestions(initialSet.items)),
  );
  const [quizSettings, setQuizSettings] =
    useState<QuizSettings>(defaultQuizSettings);

  const selectedActivity = activityDefinitions.find(
    (activity) => activity.id === selectedActivityId,
  );
  const isFlashcards = selectedActivityId === "flashcards";
  const isCrossword = selectedActivityId === "crossword";
  const isWordSearch = selectedActivityId === "word-search";
  const isBingo = selectedActivityId === "bingo";
  const isMatching = selectedActivityId === "matching";
  const isMemory = selectedActivityId === "memory";
  const isQuiz = selectedActivityId === "quiz";

  const publicReady = useMemo(() => canPublishSet(initialSet), [initialSet]);
  const canPublish = visibility === "private" || publicReady;

  return (
    <section
      className={[
        "activity-studio",
        isFlashcards ? "flashcard-mode" : "",
        isCrossword ? "crossword-mode" : "",
        isWordSearch ? "word-search-mode" : "",
        isBingo ? "bingo-mode" : "",
        isMatching ? "matching-mode" : "",
        isMemory ? "memory-mode" : "",
        isQuiz ? "quiz-mode" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      id="create"
    >
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
          <div className="panel-section shared-content-source">
            <h3>Content source</h3>
            <div className="content-card">
              <span>{initialSet.subject}</span>
              <strong>{materialTitle}</strong>
              <small>
                {initialSet.language} · {initialSet.gradeBand} ·{" "}
                {items.length} words
              </small>
            </div>
          </div>

          <div className="panel-section shared-visibility">
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
              bulkText={bulkText}
              fontStyle={fontStyle}
              frontSettings={frontSettings}
              items={items}
              materialTitle={materialTitle}
              orientation={orientation}
              printSides={printSides}
              setBackSettings={setBackSettings}
              setBulkText={setBulkText}
              setCardLayout={setCardLayout}
              setCardsPerSheet={setCardsPerSheet}
              setFontStyle={setFontStyle}
              setFrontSettings={setFrontSettings}
              setItems={setItems}
              setMaterialTitle={setMaterialTitle}
              setOrientation={setOrientation}
              setPrintSides={setPrintSides}
              setSheetSize={setSheetSize}
              sheetSize={sheetSize}
            />
          ) : isWordSearch ? (
            <WordSearchControls
              bulkText={wordSearchBulkText}
              items={items}
              materialTitle={materialTitle}
              setBulkText={setWordSearchBulkText}
              setItems={setItems}
              setMaterialTitle={setMaterialTitle}
              setSettings={setWordSearchSettings}
              settings={wordSearchSettings}
            />
          ) : isBingo ? (
            <BingoControls
              bulkText={bingoBulkText}
              items={items}
              setBulkText={setBingoBulkText}
              setItems={setItems}
              setSettings={setBingoSettings}
              settings={bingoSettings}
            />
          ) : isMatching ? (
            <MatchingControls
              bulkText={matchingBulkText}
              pairs={matchingPairs}
              setBulkText={setMatchingBulkText}
              setPairs={setMatchingPairs}
              setSettings={setMatchingSettings}
              setTitle={setMatchingTitle}
              settings={matchingSettings}
              title={matchingTitle}
            />
          ) : isMemory ? (
            <MemoryControls
              bulkText={memoryBulkText}
              pairs={memoryPairs}
              setBulkText={setMemoryBulkText}
              setPairs={setMemoryPairs}
              setSettings={setMemorySettings}
              settings={memorySettings}
            />
          ) : isCrossword ? (
            <CrosswordControls
              bulkText={crosswordBulkText}
              cluePlacement={crosswordCluePlacement}
              design={crosswordDesign}
              entries={crosswordEntries}
              gridSize={crosswordGridSize}
              includeAnswerKey={includeCrosswordAnswerKey}
              instructions={crosswordInstructions}
              numbering={crosswordNumbering}
              orientation={crosswordOrientation}
              setBulkText={setCrosswordBulkText}
              setCluePlacement={setCrosswordCluePlacement}
              setDesign={setCrosswordDesign}
              setEntries={setCrosswordEntries}
              setGridSize={setCrosswordGridSize}
              setIncludeAnswerKey={setIncludeCrosswordAnswerKey}
              setInstructions={setCrosswordInstructions}
              setNumbering={setCrosswordNumbering}
              setOrientation={setCrosswordOrientation}
              setSheetSize={setCrosswordSheetSize}
              setShowWordBank={setShowCrosswordWordBank}
              setTitle={setCrosswordTitle}
              setUppercase={setCrosswordUppercase}
              sheetSize={crosswordSheetSize}
              showWordBank={showCrosswordWordBank}
              title={crosswordTitle}
              uppercase={crosswordUppercase}
            />
          ) : isQuiz ? (
            <QuizControls
              bulkText={quizBulkText}
              materialTitle={materialTitle}
              questions={quizQuestions}
              setBulkText={setQuizBulkText}
              setMaterialTitle={setMaterialTitle}
              setQuestions={setQuizQuestions}
              setSettings={setQuizSettings}
              settings={quizSettings}
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
              items={items}
              materialTitle={materialTitle}
              orientation={orientation}
              printSides={printSides}
              sheetSize={sheetSize}
            />
          ) : isWordSearch ? (
            <WordSearchPreview
              items={items}
              materialTitle={materialTitle}
              settings={wordSearchSettings}
            />
          ) : isBingo ? (
            <BingoPreview items={items} settings={bingoSettings} />
          ) : isMatching ? (
            <MatchingPreview
              pairs={matchingPairs}
              settings={matchingSettings}
              title={matchingTitle}
            />
          ) : isMemory ? (
            <MemoryPreview pairs={memoryPairs} settings={memorySettings} />
          ) : isCrossword ? (
            <CrosswordPreview
              cluePlacement={crosswordCluePlacement}
              design={crosswordDesign}
              entries={crosswordEntries}
              gridSize={crosswordGridSize}
              includeAnswerKey={includeCrosswordAnswerKey}
              instructions={crosswordInstructions}
              numbering={crosswordNumbering}
              orientation={crosswordOrientation}
              sheetSize={crosswordSheetSize}
              showWordBank={showCrosswordWordBank}
              title={crosswordTitle}
              uppercase={crosswordUppercase}
            />
          ) : isQuiz ? (
            <QuizPreview
              materialTitle={materialTitle}
              questions={quizQuestions}
              settings={quizSettings}
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
  bulkText,
  cardLayout,
  cardsPerSheet,
  fontStyle,
  frontSettings,
  items,
  materialTitle,
  orientation,
  printSides,
  setBackSettings,
  setBulkText,
  setCardLayout,
  setCardsPerSheet,
  setFontStyle,
  setFrontSettings,
  setItems,
  setMaterialTitle,
  setOrientation,
  setPrintSides,
  setSheetSize,
  sheetSize,
}: {
  backSettings: FlashcardSideSettings;
  bulkText: string;
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  frontSettings: FlashcardSideSettings;
  items: EditableVocabularyItem[];
  materialTitle: string;
  orientation: Orientation;
  printSides: PrintSides;
  setBackSettings: (settings: FlashcardSideSettings) => void;
  setBulkText: (text: string) => void;
  setCardLayout: (layout: CardLayout) => void;
  setCardsPerSheet: (count: CardsPerSheet) => void;
  setFontStyle: (font: FontStyle) => void;
  setFrontSettings: (settings: FlashcardSideSettings) => void;
  setItems: (items: EditableVocabularyItem[]) => void;
  setMaterialTitle: (title: string) => void;
  setOrientation: (orientation: Orientation) => void;
  setPrintSides: (sides: PrintSides) => void;
  setSheetSize: (size: SheetSize) => void;
  sheetSize: SheetSize;
}) {
  const [activeTab, setActiveTab] = useState<
    "title" | "texts" | "design" | "page" | "typography"
  >("title");
  const updateItem = (
    itemId: string,
    field: keyof Omit<EditableVocabularyItem, "id" | "assetId">,
    value: string,
  ) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    );
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [word = "", definition = "", example = "", translation = ""] =
          parseCsvLine(line);
        return {
          id: `bulk-${index}-${word || "word"}`,
          word,
          definition,
          example,
          translation,
          assetId: items[index % Math.max(items.length, 1)]?.assetId ?? "run-park",
        };
      })
      .filter((item) => item.word);

    if (parsed.length > 0) {
      setItems(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv = "word,definition,example,translation\nrun,To move quickly,I run in the park,correr\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-flashcards-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(/^word,definition,example,translation\r?\n/i, "");
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Flashcard settings">
        {([
          ["title", "Title"],
          ["texts", "Texts"],
          ["design", "Design"],
          ["page", "Page"],
          ["typography", "Typography/audio"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
        <label className="field-stack">
          <span>Flashcard set title</span>
          <input
            onChange={(event) => setMaterialTitle(event.target.value)}
            placeholder="Animals A1, Irregular verbs, Classroom objects..."
            type="text"
            value={materialTitle}
          />
        </label>
        <p className="policy-note">
          This name will be used for saving, publishing, and finding the material later.
        </p>
          </>
        ) : null}

        {activeTab === "texts" ? (
          <>
        <div className="csv-actions">
          <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
            Download CSV template
          </button>
          <label className="secondary-button file-button">
            Upload CSV
            <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
          </label>
        </div>
        <label className="field-stack">
          <span>Paste CSV rows</span>
          <textarea
            onBlur={() => applyBulkText(bulkText)}
            onChange={(event) => setBulkText(event.target.value)}
            rows={5}
            value={bulkText}
          />
        </label>
        <div className="editable-table">
          {items.slice(0, 6).map((item) => (
            <div className="editable-row" key={item.id}>
              <input
                aria-label="Word"
                onChange={(event) => updateItem(item.id, "word", event.target.value)}
                value={item.word}
              />
              <input
                aria-label="Definition"
                onChange={(event) =>
                  updateItem(item.id, "definition", event.target.value)
                }
                value={item.definition}
              />
              <input
                aria-label="Example"
                onChange={(event) => updateItem(item.id, "example", event.target.value)}
                value={item.example}
              />
              <input
                aria-label="Translation"
                onChange={(event) =>
                  updateItem(item.id, "translation", event.target.value)
                }
                placeholder="Translation"
                value={item.translation}
              />
            </div>
          ))}
        </div>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
        <h4>Print sides</h4>
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
        ) : null}

        {activeTab === "page" ? (
          <>
        <h4>Cards per sheet</h4>
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
        <h4>Grid layout</h4>
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
        <h4>Sheet</h4>
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
          </>
        ) : null}

        {activeTab === "typography" ? (
          <>
        <h4>Font style</h4>
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
        <p className="policy-note">
          Enable the Audio QR field on either side to show a scan code for word audio.
        </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function CrosswordControls({
  bulkText,
  cluePlacement,
  design,
  entries,
  gridSize,
  includeAnswerKey,
  instructions,
  numbering,
  orientation,
  setBulkText,
  setCluePlacement,
  setDesign,
  setEntries,
  setGridSize,
  setIncludeAnswerKey,
  setInstructions,
  setNumbering,
  setOrientation,
  setSheetSize,
  setShowWordBank,
  setTitle,
  setUppercase,
  sheetSize,
  showWordBank,
  title,
  uppercase,
}: {
  bulkText: string;
  cluePlacement: CrosswordCluePlacement;
  design: CrosswordDesignSettings;
  entries: CrosswordEntry[];
  gridSize: number;
  includeAnswerKey: boolean;
  instructions: string;
  numbering: CrosswordNumbering;
  orientation: Orientation;
  setBulkText: (text: string) => void;
  setCluePlacement: (placement: CrosswordCluePlacement) => void;
  setDesign: (settings: CrosswordDesignSettings) => void;
  setEntries: (entries: CrosswordEntry[]) => void;
  setGridSize: (size: number) => void;
  setIncludeAnswerKey: (include: boolean) => void;
  setInstructions: (instructions: string) => void;
  setNumbering: (numbering: CrosswordNumbering) => void;
  setOrientation: (orientation: Orientation) => void;
  setSheetSize: (size: SheetSize) => void;
  setShowWordBank: (show: boolean) => void;
  setTitle: (title: string) => void;
  setUppercase: (uppercase: boolean) => void;
  sheetSize: SheetSize;
  showWordBank: boolean;
  title: string;
  uppercase: boolean;
}) {
  const [activeTab, setActiveTab] = useState<CrosswordTab>("title");

  const updateDesign = (changes: Partial<CrosswordDesignSettings>) => {
    setDesign({ ...design, ...changes });
  };
  const updateEntry = (
    entryId: string,
    field: keyof Omit<CrosswordEntry, "id">,
    value: string,
  ) => {
    setEntries(
      entries.map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry,
      ),
    );
  };
  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: `crossword-custom-${Date.now()}`,
        word: "",
        clue: "",
      },
    ]);
  };
  const removeEntry = (entryId: string) => {
    if (entries.length <= 1) {
      setEntries([{ id: "crossword-empty", word: "", clue: "" }]);
      return;
    }

    setEntries(entries.filter((entry) => entry.id !== entryId));
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [word = "", clue = ""] = parseCsvLine(line);
        return {
          id: `crossword-bulk-${index}-${normalizeCrosswordWord(word) || "word"}`,
          word,
          clue,
        };
      })
      .filter((entry) => entry.word.trim());

    if (parsed.length > 0) {
      setEntries(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,clue\nrun,To move quickly using your legs\nread,To look at words and understand them\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-crossword-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(/^word,(clue|definition)\r?\n/i, "");
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };

  return (
    <div className="tabbed-config crossword-config">
      <div className="tab-list" role="tablist" aria-label="Crossword settings">
        {([
          ["title", "Title"],
          ["words", "Words/Clues"],
          ["puzzle", "Puzzle"],
          ["design", "Design"],
          ["page", "Page"],
          ["answer", "Answer key"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Crossword title</span>
              <input
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Classroom actions crossword"
                type="text"
                value={title}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => setInstructions(event.target.value)}
                rows={4}
                value={instructions}
              />
            </label>
            <p className="policy-note">
              The title and instructions appear at the top of the printable worksheet.
            </p>
          </>
        ) : null}

        {activeTab === "words" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                placeholder="word,clue"
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table crossword-entry-table">
              {entries.map((entry) => (
                <div className="editable-row crossword-editable-row" key={entry.id}>
                  <input
                    aria-label="Word"
                    onChange={(event) => updateEntry(entry.id, "word", event.target.value)}
                    placeholder="Word"
                    value={entry.word}
                  />
                  <input
                    aria-label="Clue"
                    onChange={(event) => updateEntry(entry.id, "clue", event.target.value)}
                    placeholder="Clue"
                    value={entry.clue}
                  />
                  <button
                    className="icon-button"
                    onClick={() => removeEntry(entry.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="secondary-button" onClick={addEntry} type="button">
              Add word + clue
            </button>
          </>
        ) : null}

        {activeTab === "puzzle" ? (
          <>
            <label className="range-control">
              <span>Grid size: {gridSize} x {gridSize}</span>
              <input
                max="18"
                min="8"
                onChange={(event) => setGridSize(Number(event.target.value))}
                type="range"
                value={gridSize}
              />
            </label>
            <h4>Clue numbering</h4>
            <div className="segmented">
              <button
                className={numbering === "position" ? "active" : ""}
                onClick={() => setNumbering("position")}
                type="button"
              >
                Grid position
              </button>
              <button
                className={numbering === "entry-order" ? "active" : ""}
                onClick={() => setNumbering("entry-order")}
                type="button"
              >
                Word order
              </button>
            </div>
            <h4>Clue layout</h4>
            <div className="segmented">
              <button
                className={cluePlacement === "beside" ? "active" : ""}
                onClick={() => setCluePlacement("beside")}
                type="button"
              >
                Beside grid
              </button>
              <button
                className={cluePlacement === "below" ? "active" : ""}
                onClick={() => setCluePlacement("below")}
                type="button"
              >
                Below grid
              </button>
            </div>
            <button
              className={showWordBank ? "toggle-row active" : "toggle-row"}
              onClick={() => setShowWordBank(!showWordBank)}
              type="button"
            >
              Show word bank
            </button>
            <button
              className={uppercase ? "toggle-row active" : "toggle-row"}
              onClick={() => setUppercase(!uppercase)}
              type="button"
            >
              Uppercase words in preview
            </button>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
            <h4>Cell density</h4>
            <div className="segmented three">
              {(["compact", "comfortable", "large"] as CrosswordDensity[]).map((density) => (
                <button
                  className={design.density === density ? "active" : ""}
                  key={density}
                  onClick={() => updateDesign({ density })}
                  type="button"
                >
                  {density}
                </button>
              ))}
            </div>
            <ColorPalette
              colors={backgroundColors}
              label="Background"
              selectedColor={design.backgroundColor}
              onSelect={(backgroundColor) => updateDesign({ backgroundColor })}
            />
            <ColorPalette
              colors={crosswordCellColors}
              label="Cells"
              selectedColor={design.cellColor}
              onSelect={(cellColor) => updateDesign({ cellColor })}
            />
            <ColorPalette
              colors={frameColors}
              label="Border"
              selectedColor={design.borderColor}
              onSelect={(borderColor) => updateDesign({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Text"
              selectedColor={design.textColor}
              onSelect={(textColor) => updateDesign({ textColor })}
            />
            <ColorPalette
              colors={crosswordAccentColors}
              label="Accent"
              selectedColor={design.accentColor}
              onSelect={(accentColor) => updateDesign({ accentColor })}
            />
            <h4>Font style</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
                <button
                  className={design.fontStyle === font ? "active" : ""}
                  key={font}
                  onClick={() => updateDesign({ fontStyle: font })}
                  type="button"
                >
                  {font}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Orientation</h4>
            <div className="segmented">
              <button
                className={orientation === "portrait" ? "active" : ""}
                onClick={() => setOrientation("portrait")}
                type="button"
              >
                Portrait
              </button>
              <button
                className={orientation === "landscape" ? "active" : ""}
                onClick={() => setOrientation("landscape")}
                type="button"
              >
                Landscape
              </button>
            </div>
            <h4>Page size</h4>
            <div className="sheet-size-list">
              {(["letter", "a4", "legal"] as SheetSize[]).map((size) => (
                <button
                  className={sheetSize === size ? "plan-option active" : "plan-option"}
                  key={size}
                  onClick={() => setSheetSize(size)}
                  type="button"
                >
                  <strong>{size.toUpperCase()}</strong>
                  <small>{size === "letter" ? "US classrooms" : "Printable page"}</small>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "answer" ? (
          <>
            <button
              className={includeAnswerKey ? "toggle-row active" : "toggle-row"}
              onClick={() => setIncludeAnswerKey(!includeAnswerKey)}
              type="button"
            >
              Include answer key page
            </button>
            <p className="policy-note">
              The student worksheet stays blank. The answer key shows the placed letters
              and any words that could not fit in the selected grid.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function WordSearchControls({
  bulkText,
  items,
  materialTitle,
  setBulkText,
  setItems,
  setMaterialTitle,
  setSettings,
  settings,
}: {
  bulkText: string;
  items: EditableVocabularyItem[];
  materialTitle: string;
  setBulkText: (text: string) => void;
  setItems: (items: EditableVocabularyItem[]) => void;
  setMaterialTitle: (title: string) => void;
  setSettings: (settings: WordSearchSettings) => void;
  settings: WordSearchSettings;
}) {
  const [activeTab, setActiveTab] = useState<
    "title" | "words" | "puzzle" | "design" | "page" | "answer-key"
  >("title");

  const updateSettings = (updates: Partial<WordSearchSettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updateItem = (
    itemId: string,
    field: keyof Pick<EditableVocabularyItem, "word" | "definition">,
    value: string,
  ) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    );
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [word = "", definition = "", example = "", translation = ""] =
          parseCsvLine(line);

        return {
          id: `word-search-${index}-${slugifyId(word || "word")}`,
          word,
          definition,
          example: example || (word ? `Find ${word} in the puzzle.` : ""),
          translation,
          assetId: items[index % Math.max(items.length, 1)]?.assetId ?? "run-park",
        };
      })
      .filter((item) => item.word);

    if (parsed.length > 0) {
      setItems(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,hint,example,translation\nread,Look at words and understand them,We read a story,leer\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-word-search-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(/^word,hint,example,translation\r?\n/i, "");
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };
  const applyDifficulty = (difficulty: WordSearchDifficulty) => {
    const nextSettingsByDifficulty: Record<
      WordSearchDifficulty,
      Pick<WordSearchSettings, "directions" | "gridSize">
    > = {
      easy: {
        gridSize: 8,
        directions: {
          horizontal: true,
          vertical: true,
          diagonal: false,
          backwards: false,
        },
      },
      standard: {
        gridSize: 10,
        directions: {
          horizontal: true,
          vertical: true,
          diagonal: true,
          backwards: false,
        },
      },
      challenge: {
        gridSize: 12,
        directions: {
          horizontal: true,
          vertical: true,
          diagonal: true,
          backwards: true,
        },
      },
    };

    setSettings({
      ...settings,
      difficulty,
      ...nextSettingsByDifficulty[difficulty],
    });
  };
  const toggleDirection = (direction: WordSearchDirection) => {
    const directions = {
      ...settings.directions,
      [direction]: !settings.directions[direction],
    };

    if (!Object.values(directions).some(Boolean)) {
      return;
    }

    updateSettings({ directions });
  };
  const addWordRow = () => {
    setItems([
      ...items,
      {
        id: `word-search-custom-${items.length + 1}`,
        word: "new word",
        definition: "Custom hint",
        example: "Find the new word.",
        translation: "",
        assetId: "run-park",
      },
    ]);
  };

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Word search settings">
        {([
          ["title", "Title"],
          ["words", "Words"],
          ["puzzle", "Puzzle"],
          ["design", "Design"],
          ["page", "Page"],
          ["answer-key", "Answer key"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Worksheet title</span>
              <input
                onChange={(event) => setMaterialTitle(event.target.value)}
                placeholder="Classroom actions word search"
                type="text"
                value={materialTitle}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => updateSettings({ instructions: event.target.value })}
                rows={4}
                value={settings.instructions}
              />
            </label>
            <p className="policy-note">
              The title and instructions appear at the top of the printable worksheet.
            </p>
          </>
        ) : null}

        {activeTab === "words" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste one word per line or CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table word-search-words">
              {items.slice(0, 10).map((item) => (
                <div className="editable-row" key={item.id}>
                  <input
                    aria-label="Hidden word"
                    onChange={(event) => updateItem(item.id, "word", event.target.value)}
                    value={item.word}
                  />
                  <input
                    aria-label="Word hint"
                    onChange={(event) =>
                      updateItem(item.id, "definition", event.target.value)
                    }
                    placeholder="Hint or clue"
                    value={item.definition}
                  />
                </div>
              ))}
            </div>
            <button className="secondary-button" onClick={addWordRow} type="button">
              Add word row
            </button>
            <p className="policy-note">
              Preview uses the first words that fit in the selected grid. CSV columns:
              word, hint, example, translation.
            </p>
          </>
        ) : null}

        {activeTab === "puzzle" ? (
          <>
            <h4>Difficulty</h4>
            <div className="template-list">
              {wordSearchDifficultyOptions.map((option) => (
                <button
                  className={
                    settings.difficulty === option.key
                      ? "template-option active"
                      : "template-option"
                  }
                  key={option.key}
                  onClick={() => applyDifficulty(option.key)}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
            <h4>Grid size</h4>
            <div className="segmented four">
              {wordSearchGridSizes.map((size) => (
                <button
                  className={settings.gridSize === size ? "active" : ""}
                  key={size}
                  onClick={() => updateSettings({ gridSize: size })}
                  type="button"
                >
                  {size} x {size}
                </button>
              ))}
            </div>
            <h4>Allowed directions</h4>
            <div className="content-toggle-grid">
              {wordSearchDirectionOptions.map((option) => (
                <button
                  className={settings.directions[option.key] ? "active" : ""}
                  key={option.key}
                  onClick={() => toggleDirection(option.key)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <h4>Letter case</h4>
            <div className="segmented">
              <button
                className={settings.letterCase === "uppercase" ? "active" : ""}
                onClick={() => updateSettings({ letterCase: "uppercase" })}
                type="button"
              >
                Uppercase
              </button>
              <button
                className={settings.letterCase === "lowercase" ? "active" : ""}
                onClick={() => updateSettings({ letterCase: "lowercase" })}
                type="button"
              >
                Lowercase
              </button>
            </div>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
            <ColorPalette
              colors={backgroundColors}
              label="Background"
              selectedColor={settings.backgroundColor}
              onSelect={(backgroundColor) => updateSettings({ backgroundColor })}
            />
            <ColorPalette
              colors={frameColors}
              label="Border"
              selectedColor={settings.borderColor}
              onSelect={(borderColor) => updateSettings({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Text"
              selectedColor={settings.textColor}
              onSelect={(textColor) => updateSettings({ textColor })}
            />
            <ColorPalette
              colors={["#0891b2", "#f97316", "#7c3aed", "#16a34a", "#db2777"]}
              label="Accent"
              selectedColor={settings.accentColor}
              onSelect={(accentColor) => updateSettings({ accentColor })}
            />
            <h4>Font style</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
                <button
                  className={settings.fontStyle === font ? "active" : ""}
                  key={font}
                  onClick={() => updateSettings({ fontStyle: font })}
                  type="button"
                >
                  {font}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
            <div className="sheet-size-list">
              <button
                className={settings.sheetSize === "letter" ? "plan-option active" : "plan-option"}
                onClick={() => updateSettings({ sheetSize: "letter" })}
                type="button"
              >
                <strong>Letter</strong>
                <small>Default</small>
              </button>
              <LockedOption enabled={false} label="A4" value="Members only" />
              <LockedOption enabled={false} label="Legal" value="Members only" />
            </div>
            <button
              className={settings.showWordBank ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showWordBank: !settings.showWordBank })}
              type="button"
            >
              Show word bank
            </button>
            <button
              className={settings.includePictureHints ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ includePictureHints: !settings.includePictureHints })
              }
              type="button"
            >
              Include picture hints
            </button>
            <p className="policy-note">
              Picture hints use available classroom-safe assets from the vocabulary set.
            </p>
          </>
        ) : null}

        {activeTab === "answer-key" ? (
          <>
            <button
              className={settings.includeAnswerKey ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ includeAnswerKey: !settings.includeAnswerKey })}
              type="button"
            >
              Include teacher answer key
            </button>
            <h4>Highlight style</h4>
            <div className="segmented three">
              {wordSearchHighlightOptions.map((option) => (
                <button
                  className={settings.highlightStyle === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ highlightStyle: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="policy-note">
              Turn the answer key off for a student-only worksheet, or keep it visible for
              teacher printing.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function QuizControls({
  bulkText,
  materialTitle,
  questions,
  setBulkText,
  setMaterialTitle,
  setQuestions,
  setSettings,
  settings,
}: {
  bulkText: string;
  materialTitle: string;
  questions: QuizQuestion[];
  setBulkText: (text: string) => void;
  setMaterialTitle: (title: string) => void;
  setQuestions: (questions: QuizQuestion[]) => void;
  setSettings: (settings: QuizSettings) => void;
  settings: QuizSettings;
}) {
  const [activeTab, setActiveTab] = useState<
    "title" | "questions" | "layout" | "design" | "page" | "answer-key"
  >("title");

  const updateSettings = (updates: Partial<QuizSettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, ...updates } : question,
      ),
    );
  };
  const updateQuestionType = (question: QuizQuestion, type: QuizQuestionType) => {
    const choices = getDefaultQuizChoices(type, question.choices);
    updateQuestion(question.id, {
      choices,
      correctAnswer: getDefaultQuizAnswer(type, choices, question.correctAnswer),
      type,
    });
  };
  const applyBulkText = (text: string) => {
    const parsed = parseQuizBulkText(text, questions);

    if (parsed.length > 0) {
      setQuestions(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv = [
      "question,type,points,choices,answer",
      '"What does run mean?",multiple-choice,1,"To move quickly|To read quietly|To write neatly|To listen carefully","To move quickly"',
      '"The word listen means pay attention to sound.",true-false,1,"True|False",True',
      '"Use write in a sentence.",short-answer,2,"","I write my name."',
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-quiz-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(/^question,type,points,choices,answer\r?\n/i, "");
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };
  const addQuestion = (type: QuizQuestionType = "multiple-choice") => {
    const choices = getDefaultQuizChoices(type);
    setQuestions([
      ...questions,
      {
        id: `quiz-custom-${questions.length + 1}`,
        prompt: "New question",
        type,
        choices,
        correctAnswer: getDefaultQuizAnswer(type, choices),
        points: type === "short-answer" ? 2 : 1,
      },
    ]);
  };
  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) {
      return;
    }

    setQuestions(questions.filter((question) => question.id !== questionId));
  };
  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Quiz settings">
        {([
          ["title", "Title"],
          ["questions", "Questions"],
          ["layout", "Layout"],
          ["design", "Design"],
          ["page", "Page"],
          ["answer-key", "Answer key"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Quiz title</span>
              <input
                onChange={(event) => setMaterialTitle(event.target.value)}
                placeholder="Classroom actions quiz"
                type="text"
                value={materialTitle}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => updateSettings({ instructions: event.target.value })}
                rows={4}
                value={settings.instructions}
              />
            </label>
            <p className="policy-note">
              This quiz has {questions.length} question(s) and {totalPoints} total point(s).
            </p>
          </>
        ) : null}

        {activeTab === "questions" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="quiz-question-bank">
              {questions.map((question, index) => (
                <article className="quiz-question-editor" key={question.id}>
                  <div className="quiz-question-editor-header">
                    <strong>Question {index + 1}</strong>
                    <button
                      className="text-button"
                      onClick={() => removeQuestion(question.id)}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="field-stack">
                    <span>Question prompt</span>
                    <textarea
                      onChange={(event) =>
                        updateQuestion(question.id, { prompt: event.target.value })
                      }
                      rows={2}
                      value={question.prompt}
                    />
                  </label>
                  <div className="inline-field-grid">
                    <label className="field-stack">
                      <span>Question type</span>
                      <select
                        onChange={(event) =>
                          updateQuestionType(
                            question,
                            event.target.value as QuizQuestionType,
                          )
                        }
                        value={question.type}
                      >
                        {quizQuestionTypeOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field-stack">
                      <span>Points</span>
                      <input
                        min="0"
                        onChange={(event) =>
                          updateQuestion(question.id, {
                            points: Number(event.target.value) || 0,
                          })
                        }
                        type="number"
                        value={question.points}
                      />
                    </label>
                  </div>
                  {question.type === "multiple-choice" ? (
                    <>
                      <label className="field-stack">
                        <span>Answer choices</span>
                        <textarea
                          onChange={(event) =>
                            updateQuestion(question.id, {
                              choices: splitQuizChoices(event.target.value),
                            })
                          }
                          rows={2}
                          value={question.choices.join(" | ")}
                        />
                      </label>
                      <label className="field-stack">
                        <span>Correct answer</span>
                        <input
                          onChange={(event) =>
                            updateQuestion(question.id, {
                              correctAnswer: event.target.value,
                            })
                          }
                          value={question.correctAnswer}
                        />
                      </label>
                    </>
                  ) : null}
                  {question.type === "true-false" ? (
                    <>
                      <h4>Correct answer</h4>
                      <div className="segmented">
                        {["True", "False"].map((answer) => (
                          <button
                            className={question.correctAnswer === answer ? "active" : ""}
                            key={answer}
                            onClick={() =>
                              updateQuestion(question.id, { correctAnswer: answer })
                            }
                            type="button"
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {question.type === "short-answer" ? (
                    <label className="field-stack">
                      <span>Suggested answer</span>
                      <input
                        onChange={(event) =>
                          updateQuestion(question.id, {
                            correctAnswer: event.target.value,
                          })
                        }
                        value={question.correctAnswer}
                      />
                    </label>
                  ) : null}
                </article>
              ))}
            </div>
            <div className="content-toggle-grid">
              {quizQuestionTypeOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => addQuestion(option.key)}
                  type="button"
                >
                  Add {option.label}
                </button>
              ))}
            </div>
            <p className="policy-note">
              CSV columns: question, type, points, choices, answer. Separate multiple
              choice options with vertical bars.
            </p>
          </>
        ) : null}

        {activeTab === "layout" ? (
          <>
            <button
              className={settings.randomizeQuestions ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ randomizeQuestions: !settings.randomizeQuestions })
              }
              type="button"
            >
              Randomize question order
            </button>
            <button
              className={settings.randomizeOptions ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ randomizeOptions: !settings.randomizeOptions })
              }
              type="button"
            >
              Randomize multiple-choice options
            </button>
            <button
              className={settings.showScoreBoxes ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ showScoreBoxes: !settings.showScoreBoxes })
              }
              type="button"
            >
              Show score boxes
            </button>
            <h4>Numbering style</h4>
            <div className="segmented three">
              {quizNumberingOptions.map((option) => (
                <button
                  className={settings.numberingStyle === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ numberingStyle: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <h4>Question spacing</h4>
            <div className="segmented three">
              {quizSpacingOptions.map((option) => (
                <button
                  className={settings.questionSpacing === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ questionSpacing: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="range-control">
              <span>Lines for written answers: {settings.writtenAnswerLines}</span>
              <input
                max="8"
                min="1"
                onChange={(event) =>
                  updateSettings({ writtenAnswerLines: Number(event.target.value) })
                }
                type="range"
                value={settings.writtenAnswerLines}
              />
            </label>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
            <ColorPalette
              colors={backgroundColors}
              label="Background"
              selectedColor={settings.backgroundColor}
              onSelect={(backgroundColor) => updateSettings({ backgroundColor })}
            />
            <ColorPalette
              colors={["#cbd5e1", "#475569", "#f97316", "#7c3aed", "#0891b2"]}
              label="Border"
              selectedColor={settings.borderColor}
              onSelect={(borderColor) => updateSettings({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Text"
              selectedColor={settings.textColor}
              onSelect={(textColor) => updateSettings({ textColor })}
            />
            <ColorPalette
              colors={["#475569", "#2563eb", "#0891b2", "#16a34a", "#db2777"]}
              label="Accent"
              selectedColor={settings.accentColor}
              onSelect={(accentColor) => updateSettings({ accentColor })}
            />
            <h4>Font style</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
                <button
                  className={settings.fontStyle === font ? "active" : ""}
                  key={font}
                  onClick={() => updateSettings({ fontStyle: font })}
                  type="button"
                >
                  {font}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
            <h4>Page size</h4>
            <div className="sheet-size-list">
              {(["letter", "a4", "legal"] as SheetSize[]).map((size) => (
                <button
                  className={settings.sheetSize === size ? "plan-option active" : "plan-option"}
                  key={size}
                  onClick={() => updateSettings({ sheetSize: size })}
                  type="button"
                >
                  <strong>{size.toUpperCase()}</strong>
                  <small>{size === "letter" ? "US classrooms" : "Printable page"}</small>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "answer-key" ? (
          <>
            <button
              className={settings.showAnswerKey ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showAnswerKey: !settings.showAnswerKey })}
              type="button"
            >
              Show answer key in preview
            </button>
            <div className="quiz-answer-summary">
              {questions.slice(0, 6).map((question, index) => (
                <div key={`${question.id}-answer-summary`}>
                  <span>{formatQuizQuestionNumber(index, settings.numberingStyle)}</span>
                  <strong>{question.correctAnswer || "No answer yet"}</strong>
                </div>
              ))}
            </div>
            <p className="policy-note">
              Hide the key for a student copy, or keep it visible for teacher printing.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function MatchingControls({
  bulkText,
  pairs,
  setBulkText,
  setPairs,
  setSettings,
  setTitle,
  settings,
  title,
}: {
  bulkText: string;
  pairs: MatchingPair[];
  setBulkText: (text: string) => void;
  setPairs: (pairs: MatchingPair[]) => void;
  setSettings: (settings: MatchingSettings) => void;
  setTitle: (title: string) => void;
  settings: MatchingSettings;
  title: string;
}) {
  const [activeTab, setActiveTab] = useState<MatchingTab>("title");
  const updateSettings = (updates: Partial<MatchingSettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updatePair = (
    pairId: string,
    field: keyof Omit<MatchingPair, "id">,
    value: string,
  ) => {
    setPairs(
      pairs.map((pair) => (pair.id === pairId ? { ...pair, [field]: value } : pair)),
    );
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [
          word = "",
          definition = "",
          translation = "",
          sentence = "",
          assetId = "",
        ] = parseCsvLine(line);

        return {
          id: `matching-${index}-${slugifyId(word || "pair")}`,
          word,
          definition,
          translation,
          sentence,
          assetId: assetId || pairs[index % Math.max(pairs.length, 1)]?.assetId || "run-park",
        };
      })
      .filter((pair) => pair.word || pair.definition || pair.translation || pair.sentence);

    if (parsed.length > 0) {
      setPairs(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,definition,translation,sentence,imageAssetId\nrun,To move quickly,correr,I run in the park,run-park\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-matching-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(
      /^word,definition,translation,sentence,imageAssetId\r?\n/i,
      "",
    );
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };
  const addPairRow = () => {
    setPairs([
      ...pairs,
      {
        id: `matching-custom-${pairs.length + 1}`,
        word: "new word",
        definition: "Custom definition",
        translation: "",
        sentence: "Use the new word in a sentence.",
        assetId: "run-park",
      },
    ]);
  };

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Matching settings">
        {([
          ["title", "Title"],
          ["pairs", "Pairs"],
          ["match-type", "Match type"],
          ["design", "Design"],
          ["page", "Page"],
          ["answer-key", "Answer key"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Activity title</span>
              <input
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Classroom actions matching"
                type="text"
                value={title}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => updateSettings({ instructions: event.target.value })}
                rows={4}
                value={settings.instructions}
              />
            </label>
            <p className="policy-note">
              These appear above the printable matching worksheet or cut-out card set.
            </p>
          </>
        ) : null}

        {activeTab === "pairs" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table matching-pair-table">
              {pairs.slice(0, 12).map((pair) => (
                <div className="editable-row" key={pair.id}>
                  <input
                    aria-label="Word"
                    onChange={(event) => updatePair(pair.id, "word", event.target.value)}
                    placeholder="Word"
                    value={pair.word}
                  />
                  <input
                    aria-label="Definition"
                    onChange={(event) =>
                      updatePair(pair.id, "definition", event.target.value)
                    }
                    placeholder="Definition"
                    value={pair.definition}
                  />
                  <input
                    aria-label="Translation"
                    onChange={(event) =>
                      updatePair(pair.id, "translation", event.target.value)
                    }
                    placeholder="Translation"
                    value={pair.translation}
                  />
                  <input
                    aria-label="Sentence"
                    onChange={(event) => updatePair(pair.id, "sentence", event.target.value)}
                    placeholder="Sentence"
                    value={pair.sentence}
                  />
                  <input
                    aria-label="Image asset ID"
                    onChange={(event) => updatePair(pair.id, "assetId", event.target.value)}
                    placeholder="Image asset ID"
                    value={pair.assetId}
                  />
                </div>
              ))}
            </div>
            <button className="secondary-button" onClick={addPairRow} type="button">
              Add pair row
            </button>
            <p className="policy-note">
              CSV columns: word, definition, translation, sentence, imageAssetId.
            </p>
          </>
        ) : null}

        {activeTab === "match-type" ? (
          <>
            <h4>Match mode</h4>
            <div className="template-list">
              {matchingModeOptions.map((option) => (
                <button
                  className={
                    settings.matchMode === option.key
                      ? "template-option active"
                      : "template-option"
                  }
                  key={option.key}
                  onClick={() => updateSettings({ matchMode: option.key })}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
            <h4>Student format</h4>
            <div className="segmented">
              <button
                className={settings.outputStyle === "worksheet-lines" ? "active" : ""}
                onClick={() => updateSettings({ outputStyle: "worksheet-lines" })}
                type="button"
              >
                Worksheet lines
              </button>
              <button
                className={settings.outputStyle === "cut-out-cards" ? "active" : ""}
                onClick={() => updateSettings({ outputStyle: "cut-out-cards" })}
                type="button"
              >
                Cut-out cards
              </button>
            </div>
            <h4>Columns layout</h4>
            <div className="segmented three">
              {(["one", "two", "three"] as MatchingColumns[]).map((columns) => (
                <button
                  className={settings.columns === columns ? "active" : ""}
                  key={columns}
                  onClick={() => updateSettings({ columns })}
                  type="button"
                >
                  {columns}
                </button>
              ))}
            </div>
            <button
              className={settings.shuffleLeft ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ shuffleLeft: !settings.shuffleLeft })}
              type="button"
            >
              Shuffle left column
            </button>
            <button
              className={settings.shuffleRight ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ shuffleRight: !settings.shuffleRight })}
              type="button"
            >
              Shuffle right column
            </button>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
            <ColorPalette
              colors={backgroundColors}
              label="Background"
              selectedColor={settings.backgroundColor}
              onSelect={(backgroundColor) => updateSettings({ backgroundColor })}
            />
            <ColorPalette
              colors={frameColors}
              label="Border"
              selectedColor={settings.borderColor}
              onSelect={(borderColor) => updateSettings({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Text"
              selectedColor={settings.textColor}
              onSelect={(textColor) => updateSettings({ textColor })}
            />
            <ColorPalette
              colors={["#16a34a", "#0891b2", "#f97316", "#7c3aed", "#db2777"]}
              label="Accent"
              selectedColor={settings.accentColor}
              onSelect={(accentColor) => updateSettings({ accentColor })}
            />
            <h4>Font style</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((fontStyle) => (
                <button
                  className={settings.fontStyle === fontStyle ? "active" : ""}
                  key={fontStyle}
                  onClick={() => updateSettings({ fontStyle })}
                  type="button"
                >
                  {fontStyle}
                </button>
              ))}
            </div>
            <h4>Line style</h4>
            <div className="segmented three">
              {matchingLineStyleOptions.map((option) => (
                <button
                  className={settings.lineStyle === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ lineStyle: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <h4>Spacing</h4>
            <div className="segmented three">
              {matchingSpacingOptions.map((option) => (
                <button
                  className={settings.spacing === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ spacing: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              className={settings.includeImages ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ includeImages: !settings.includeImages })}
              type="button"
            >
              Include images when available
            </button>
            <button
              className={settings.includeNumbering ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ includeNumbering: !settings.includeNumbering })
              }
              type="button"
            >
              Include numbering and letters
            </button>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
            <div className="sheet-size-list">
              <button
                className={settings.sheetSize === "letter" ? "plan-option active" : "plan-option"}
                onClick={() => updateSettings({ sheetSize: "letter" })}
                type="button"
              >
                <strong>Letter</strong>
                <small>Default</small>
              </button>
              <button
                className={settings.sheetSize === "a4" ? "plan-option active" : "plan-option"}
                onClick={() => updateSettings({ sheetSize: "a4" })}
                type="button"
              >
                <strong>A4</strong>
                <small>International</small>
              </button>
              <button
                className={settings.sheetSize === "legal" ? "plan-option active" : "plan-option"}
                onClick={() => updateSettings({ sheetSize: "legal" })}
                type="button"
              >
                <strong>Legal</strong>
                <small>Long worksheet</small>
              </button>
            </div>
            <h4>Pairs or cards per page</h4>
            <div className="segmented five">
              {matchingPairsPerPageOptions.map((count) => (
                <button
                  className={settings.pairsPerPage === count ? "active" : ""}
                  key={count}
                  onClick={() => updateSettings({ pairsPerPage: count })}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "answer-key" ? (
          <>
            <button
              className={settings.showAnswerKey ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showAnswerKey: !settings.showAnswerKey })}
              type="button"
            >
              Show teacher answer key
            </button>
            <p className="policy-note">
              The answer key reflects the current deterministic shuffle order in the preview.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function BingoControls({
  bulkText,
  items,
  setBulkText,
  setItems,
  setSettings,
  settings,
}: {
  bulkText: string;
  items: EditableVocabularyItem[];
  setBulkText: (text: string) => void;
  setItems: (items: EditableVocabularyItem[]) => void;
  setSettings: (settings: BingoSettings) => void;
  settings: BingoSettings;
}) {
  const [activeTab, setActiveTab] = useState<
    "title" | "items" | "board" | "design" | "page" | "caller-cards"
  >("title");

  const updateSettings = (updates: Partial<BingoSettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updateItem = (
    itemId: string,
    field: keyof Pick<EditableVocabularyItem, "word" | "definition">,
    value: string,
  ) => {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
    );
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [word = "", caption = "", example = "", translation = ""] =
          parseCsvLine(line);

        return {
          id: `bingo-${index}-${slugifyId(word || "item")}`,
          word,
          definition: caption,
          example,
          translation,
          assetId: items[index % Math.max(items.length, 1)]?.assetId ?? "run-park",
        };
      })
      .filter((item) => item.word);

    if (parsed.length > 0) {
      setItems(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,caption,example,translation\nread,Reading a book,We read together,leer\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-bingo-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(/^word,caption,example,translation\r?\n/i, "");
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };
  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: `bingo-custom-${items.length + 1}`,
        word: "new item",
        definition: "Caller clue or image caption",
        example: "",
        translation: "",
        assetId: "run-park",
      },
    ]);
  };

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Bingo settings">
        {([
          ["title", "Title"],
          ["items", "Items"],
          ["board", "Board"],
          ["design", "Design"],
          ["page", "Page"],
          ["caller-cards", "Caller cards"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Bingo title</span>
              <input
                onChange={(event) => updateSettings({ title: event.target.value })}
                placeholder="Classroom actions bingo"
                type="text"
                value={settings.title}
              />
            </label>
            <label className="field-stack">
              <span>Board header instructions</span>
              <textarea
                onChange={(event) =>
                  updateSettings({ headerInstructions: event.target.value })
                }
                rows={3}
                value={settings.headerInstructions}
              />
            </label>
            <label className="field-stack">
              <span>Footer instructions</span>
              <textarea
                onChange={(event) =>
                  updateSettings({ footerInstructions: event.target.value })
                }
                rows={3}
                value={settings.footerInstructions}
              />
            </label>
          </>
        ) : null}

        {activeTab === "items" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste word/image item rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table bingo-items">
              {items.slice(0, 14).map((item) => {
                const asset = getAsset(item.assetId);

                return (
                  <div className="editable-row bingo-editable-row" key={item.id}>
                    <input
                      aria-label="Bingo item word"
                      onChange={(event) => updateItem(item.id, "word", event.target.value)}
                      value={item.word}
                    />
                    <input
                      aria-label="Bingo item caption"
                      onChange={(event) =>
                        updateItem(item.id, "definition", event.target.value)
                      }
                      placeholder="Caption or caller clue"
                      value={item.definition}
                    />
                    <span>{asset ? asset.title : "No image linked"}</span>
                  </div>
                );
              })}
            </div>
            <button className="secondary-button" onClick={addItemRow} type="button">
              Add item row
            </button>
            <p className="policy-note">
              CSV columns: word, caption, example, translation. Images use linked demo
              vocabulary assets in this prototype.
            </p>
          </>
        ) : null}

        {activeTab === "board" ? (
          <>
            <h4>Board size</h4>
            <div className="segmented three">
              {bingoBoardSizes.map((size) => (
                <button
                  className={settings.boardSize === size ? "active" : ""}
                  key={size}
                  onClick={() => updateSettings({ boardSize: size })}
                  type="button"
                >
                  {size} x {size}
                </button>
              ))}
            </div>
            <label className="range-control">
              <span>Number of boards: {settings.boardCount}</span>
              <input
                max="36"
                min="1"
                onChange={(event) =>
                  updateSettings({ boardCount: Number(event.target.value) })
                }
                type="range"
                value={settings.boardCount}
              />
            </label>
            <h4>Card content</h4>
            <div className="segmented three">
              {bingoDisplayModeOptions.map((option) => (
                <button
                  className={settings.displayMode === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ displayMode: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              className={settings.freeSpace ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ freeSpace: !settings.freeSpace })}
              type="button"
            >
              Free space
            </button>
            {settings.freeSpace ? (
              <label className="field-stack">
                <span>Free space label</span>
                <input
                  onChange={(event) => updateSettings({ freeSpaceLabel: event.target.value })}
                  value={settings.freeSpaceLabel}
                />
              </label>
            ) : null}
            <button
              className={settings.randomizeBoards ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ randomizeBoards: !settings.randomizeBoards })
              }
              type="button"
            >
              Randomize each board
            </button>
          </>
        ) : null}

        {activeTab === "design" ? (
          <>
            <ColorPalette
              colors={backgroundColors}
              label="Background"
              selectedColor={settings.backgroundColor}
              onSelect={(backgroundColor) => updateSettings({ backgroundColor })}
            />
            <ColorPalette
              colors={frameColors}
              label="Border"
              selectedColor={settings.borderColor}
              onSelect={(borderColor) => updateSettings({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Text"
              selectedColor={settings.textColor}
              onSelect={(textColor) => updateSettings({ textColor })}
            />
            <ColorPalette
              colors={["#db2777", "#f97316", "#7c3aed", "#0891b2", "#16a34a"]}
              label="Accent"
              selectedColor={settings.accentColor}
              onSelect={(accentColor) => updateSettings({ accentColor })}
            />
            <h4>Font style</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
                <button
                  className={settings.fontStyle === font ? "active" : ""}
                  key={font}
                  onClick={() => updateSettings({ fontStyle: font })}
                  type="button"
                >
                  {font}
                </button>
              ))}
            </div>
            <button
              className={settings.cutLines ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ cutLines: !settings.cutLines })}
              type="button"
            >
              Show cut lines
            </button>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
            <h4>Page size</h4>
            <div className="sheet-size-list">
              {(["letter", "a4", "legal"] as SheetSize[]).map((size) => (
                <button
                  className={settings.sheetSize === size ? "plan-option active" : "plan-option"}
                  key={size}
                  onClick={() => updateSettings({ sheetSize: size })}
                  type="button"
                >
                  <strong>{size.toUpperCase()}</strong>
                  <small>{size === "letter" ? "Default" : "Printable size"}</small>
                </button>
              ))}
            </div>
            <h4>Cards per page</h4>
            <div className="segmented three">
              {bingoCardsPerPageOptions.map((count) => (
                <button
                  className={settings.cardsPerPage === count ? "active" : ""}
                  key={count}
                  onClick={() => updateSettings({ cardsPerPage: count })}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {activeTab === "caller-cards" ? (
          <>
            <button
              className={settings.includeCallList ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ includeCallList: !settings.includeCallList })
              }
              type="button"
            >
              Include call list
            </button>
            <button
              className={settings.includeCallerCards ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ includeCallerCards: !settings.includeCallerCards })
              }
              type="button"
            >
              Include caller cards
            </button>
            <button
              className={settings.showItemBank ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showItemBank: !settings.showItemBank })}
              type="button"
            >
              Show item bank on board
            </button>
            <p className="policy-note">
              Caller cards use the same item list as the boards so teachers can cut,
              shuffle, and call from one printable packet.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function MemoryControls({
  bulkText,
  pairs,
  setBulkText,
  setPairs,
  setSettings,
  settings,
}: {
  bulkText: string;
  pairs: MemoryPair[];
  setBulkText: (text: string) => void;
  setPairs: (pairs: MemoryPair[]) => void;
  setSettings: (settings: MemorySettings) => void;
  settings: MemorySettings;
}) {
  const [activeTab, setActiveTab] = useState<MemoryTab>("title");

  const updateSettings = (updates: Partial<MemorySettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updatePair = (
    pairId: string,
    field: keyof Omit<MemoryPair, "id">,
    value: string,
  ) => {
    setPairs(
      pairs.map((pair) => (pair.id === pairId ? { ...pair, [field]: value } : pair)),
    );
  };
  const addPair = () => {
    setPairs([
      ...pairs,
      {
        id: `memory-custom-${pairs.length + 1}`,
        word: "new word",
        definition: "New definition",
        translation: "",
        customLeft: "Card A",
        customRight: "Card B",
        assetId: "run-park",
      },
    ]);
  };
  const removePair = (pairId: string) => {
    if (pairs.length <= 1) {
      setPairs([
        {
          id: "memory-empty",
          word: "",
          definition: "",
          translation: "",
          customLeft: "",
          customRight: "",
          assetId: "run-park",
        },
      ]);
      return;
    }

    setPairs(pairs.filter((pair) => pair.id !== pairId));
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [
          word = "",
          definition = "",
          translation = "",
          customLeft = "",
          customRight = "",
          assetId = "",
        ] = parseCsvLine(line);

        return {
          id: `memory-bulk-${index}-${slugifyId(word || customLeft || "pair")}`,
          word,
          definition,
          translation,
          customLeft: customLeft || word,
          customRight: customRight || definition || translation,
          assetId: assetId || pairs[index % Math.max(pairs.length, 1)]?.assetId || "run-park",
        };
      })
      .filter((pair) => pair.word.trim() || pair.customLeft.trim());

    if (parsed.length > 0) {
      setPairs(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,definition,translation,custom left,custom right,assetId\nrun,To move quickly,correr,Action word,Running picture,run-park\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-memory-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(
      /^word,definition,translation,custom left,custom right,assetId\r?\n/i,
      "",
    );
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };

  return (
    <div className="tabbed-config memory-config">
      <div className="tab-list" role="tablist" aria-label="Memory card settings">
        {([
          ["title", "Title"],
          ["pairs", "Pairs"],
          ["faces", "Card faces"],
          ["back", "Back design"],
          ["page", "Page"],
          ["answer", "Answer key"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Activity title</span>
              <input
                onChange={(event) => updateSettings({ title: event.target.value })}
                placeholder="Classroom actions memory"
                type="text"
                value={settings.title}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => updateSettings({ instructions: event.target.value })}
                rows={4}
                value={settings.instructions}
              />
            </label>
            <p className="policy-note">
              The preview keeps the game printable-first: cards, backs, cut guides, and a
              teacher guide can all be printed from the browser.
            </p>
          </>
        ) : null}

        {activeTab === "pairs" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                placeholder="word,definition,translation,custom left,custom right,assetId"
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table memory-pair-table">
              {pairs.map((pair) => (
                <div className="editable-row memory-pair-row" key={pair.id}>
                  <input
                    aria-label="Word"
                    onChange={(event) => updatePair(pair.id, "word", event.target.value)}
                    placeholder="Word"
                    value={pair.word}
                  />
                  <input
                    aria-label="Definition"
                    onChange={(event) =>
                      updatePair(pair.id, "definition", event.target.value)
                    }
                    placeholder="Definition"
                    value={pair.definition}
                  />
                  <input
                    aria-label="Translation"
                    onChange={(event) =>
                      updatePair(pair.id, "translation", event.target.value)
                    }
                    placeholder="Translation"
                    value={pair.translation}
                  />
                  <input
                    aria-label="Custom left card"
                    onChange={(event) =>
                      updatePair(pair.id, "customLeft", event.target.value)
                    }
                    placeholder="Custom left"
                    value={pair.customLeft}
                  />
                  <input
                    aria-label="Custom right card"
                    onChange={(event) =>
                      updatePair(pair.id, "customRight", event.target.value)
                    }
                    placeholder="Custom right"
                    value={pair.customRight}
                  />
                  <input
                    aria-label="Image asset id"
                    onChange={(event) => updatePair(pair.id, "assetId", event.target.value)}
                    placeholder="Asset id"
                    value={pair.assetId}
                  />
                  <button
                    className="icon-button"
                    onClick={() => removePair(pair.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="secondary-button" onClick={addPair} type="button">
              Add memory pair
            </button>
          </>
        ) : null}

        {activeTab === "faces" ? (
          <>
            <h4>Pair type</h4>
            <div className="template-list">
              {memoryPairTypeOptions.map((option) => (
                <button
                  className={
                    settings.pairType === option.key
                      ? "template-option active"
                      : "template-option"
                  }
                  key={option.key}
                  onClick={() => updateSettings({ pairType: option.key })}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
            <h4>Card generation</h4>
            <div className="segmented">
              <button
                className={settings.duplicateMode === "single" ? "active" : ""}
                onClick={() => updateSettings({ duplicateMode: "single" })}
                type="button"
              >
                One pair set
              </button>
              <button
                className={settings.duplicateMode === "double" ? "active" : ""}
                onClick={() => updateSettings({ duplicateMode: "double" })}
                type="button"
              >
                Duplicate pairs
              </button>
            </div>
            <button
              className={settings.shuffleCards ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ shuffleCards: !settings.shuffleCards })}
              type="button"
            >
              Shuffle cards deterministically
            </button>
            <button
              className={settings.showPairLabels ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showPairLabels: !settings.showPairLabels })}
              type="button"
            >
              Show pair labels on cards
            </button>
          </>
        ) : null}

        {activeTab === "back" ? (
          <>
            <h4>Front design</h4>
            <ColorPalette
              colors={backgroundColors}
              label="Front background"
              selectedColor={settings.frontBackgroundColor}
              onSelect={(frontBackgroundColor) => updateSettings({ frontBackgroundColor })}
            />
            <ColorPalette
              colors={frameColors}
              label="Front border"
              selectedColor={settings.borderColor}
              onSelect={(borderColor) => updateSettings({ borderColor })}
            />
            <ColorPalette
              colors={textColors}
              label="Front text"
              selectedColor={settings.textColor}
              onSelect={(textColor) => updateSettings({ textColor })}
            />
            <h4>Back pattern</h4>
            <div className="segmented four">
              {memoryBackPatternOptions.map((option) => (
                <button
                  className={settings.backPattern === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ backPattern: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <ColorPalette
              colors={["#ca8a04", "#f97316", "#2563eb", "#7c3aed", "#111827"]}
              label="Back color"
              selectedColor={settings.backColor}
              onSelect={(backColor) => updateSettings({ backColor })}
            />
            <ColorPalette
              colors={["#fef3c7", "#ffffff", "#dbeafe", "#fce7f3", "#e2e8f0"]}
              label="Pattern color"
              selectedColor={settings.backPatternColor}
              onSelect={(backPatternColor) => updateSettings({ backPatternColor })}
            />
            <button
              className={settings.showBackLogo ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showBackLogo: !settings.showBackLogo })}
              type="button"
            >
              Show school logo placeholder on backs
            </button>
            <h4>Typography and corners</h4>
            <div className="segmented three">
              {(["rounded", "classic", "bold"] as FontStyle[]).map((font) => (
                <button
                  className={settings.fontStyle === font ? "active" : ""}
                  key={font}
                  onClick={() => updateSettings({ fontStyle: font })}
                  type="button"
                >
                  {font}
                </button>
              ))}
            </div>
            <div className="segmented">
              <button
                className={settings.cornerStyle === "rounded" ? "active" : ""}
                onClick={() => updateSettings({ cornerStyle: "rounded" })}
                type="button"
              >
                Rounded corners
              </button>
              <button
                className={settings.cornerStyle === "square" ? "active" : ""}
                onClick={() => updateSettings({ cornerStyle: "square" })}
                type="button"
              >
                Square corners
              </button>
            </div>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Card size</h4>
            <div className="segmented three">
              {memoryCardSizeOptions.map((option) => (
                <button
                  className={settings.cardSize === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ cardSize: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <h4>Cards per page</h4>
            <div className="segmented four">
              {memoryCardsPerPageOptions.map((count) => (
                <button
                  className={settings.cardsPerPage === count ? "active" : ""}
                  key={count}
                  onClick={() => updateSettings({ cardsPerPage: count })}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
            <div className="sheet-size-list">
              {(["letter", "a4", "legal"] as SheetSize[]).map((size) => (
                <button
                  className={settings.sheetSize === size ? "plan-option active" : "plan-option"}
                  key={size}
                  onClick={() => updateSettings({ sheetSize: size })}
                  type="button"
                >
                  <strong>{size.toUpperCase()}</strong>
                  <small>{size === "letter" ? "US classrooms" : "Printable page"}</small>
                </button>
              ))}
            </div>
            <button
              className={settings.cutLines ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ cutLines: !settings.cutLines })}
              type="button"
            >
              Show cut lines
            </button>
          </>
        ) : null}

        {activeTab === "answer" ? (
          <>
            <button
              className={settings.showTeacherGuide ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ showTeacherGuide: !settings.showTeacherGuide })
              }
              type="button"
            >
              Include teacher answer key / guide
            </button>
            <p className="policy-note">
              The teacher guide lists each generated pair and shows which two faces belong
              together. Turn it off for student-only printing.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MemoryControlsLegacy({
  bulkText,
  pairs,
  setBulkText,
  setPairs,
  setSettings,
  settings,
}: {
  bulkText: string;
  pairs: MemoryPair[];
  setBulkText: (text: string) => void;
  setPairs: (pairs: MemoryPair[]) => void;
  setSettings: (settings: MemorySettings) => void;
  settings: MemorySettings;
}) {
  const [activeTab, setActiveTab] = useState<MemoryTab>("title");
  const updateSettings = (updates: Partial<MemorySettings>) => {
    setSettings({ ...settings, ...updates });
  };
  const updatePair = (
    pairId: string,
    field: keyof Omit<MemoryPair, "id">,
    value: string,
  ) => {
    setPairs(
      pairs.map((pair) => (pair.id === pairId ? { ...pair, [field]: value } : pair)),
    );
  };
  const applyBulkText = (text: string) => {
    const parsed = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [
          word = "",
          definition = "",
          translation = "",
          customLeft = "",
          customRight = "",
          assetId = "",
        ] = parseCsvLine(line);

        return {
          id: `memory-${index}-${slugifyId(word || customLeft || "pair")}`,
          word,
          definition,
          translation,
          customLeft: customLeft || word,
          customRight: customRight || definition,
          assetId: assetId || pairs[index % Math.max(pairs.length, 1)]?.assetId || "run-park",
        };
      })
      .filter((pair) => pair.word || pair.definition || pair.customLeft || pair.customRight);

    if (parsed.length > 0) {
      setPairs(parsed);
    }
  };
  const downloadCsvTemplate = () => {
    const csv =
      "word,definition,translation,customLeft,customRight,imageAssetId\nrun,To move quickly,correr,run,move quickly,run-park\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "myownmaterials-memory-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const uploadCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    const withoutHeader = text.replace(
      /^word,definition,translation,customLeft,customRight,imageAssetId\r?\n/i,
      "",
    );
    setBulkText(withoutHeader.trim());
    applyBulkText(withoutHeader);
    event.target.value = "";
  };
  const addPairRow = () => {
    setPairs([
      ...pairs,
      {
        id: `memory-custom-${pairs.length + 1}`,
        word: "new word",
        definition: "Custom match",
        translation: "",
        customLeft: "new word",
        customRight: "custom match",
        assetId: "run-park",
      },
    ]);
  };

  return (
    <div className="tabbed-config">
      <div className="tab-list" role="tablist" aria-label="Memory card settings">
        {([
          ["title", "Title"],
          ["pairs", "Pairs"],
          ["faces", "Faces"],
          ["back", "Back"],
          ["page", "Page"],
          ["answer", "Teacher guide"],
        ] as const).map(([tab, label]) => (
          <button
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="tab-panel" role="tabpanel">
        {activeTab === "title" ? (
          <>
            <label className="field-stack">
              <span>Memory card title</span>
              <input
                onChange={(event) => updateSettings({ title: event.target.value })}
                value={settings.title}
              />
            </label>
            <label className="field-stack">
              <span>Student instructions</span>
              <textarea
                onChange={(event) => updateSettings({ instructions: event.target.value })}
                rows={4}
                value={settings.instructions}
              />
            </label>
          </>
        ) : null}

        {activeTab === "pairs" ? (
          <>
            <div className="csv-actions">
              <button className="secondary-button" onClick={downloadCsvTemplate} type="button">
                Download CSV template
              </button>
              <label className="secondary-button file-button">
                Upload CSV
                <input accept=".csv,text/csv" onChange={uploadCsv} type="file" />
              </label>
            </div>
            <label className="field-stack">
              <span>Paste CSV rows</span>
              <textarea
                onBlur={() => applyBulkText(bulkText)}
                onChange={(event) => setBulkText(event.target.value)}
                rows={5}
                value={bulkText}
              />
            </label>
            <div className="editable-table">
              {pairs.slice(0, 12).map((pair) => (
                <div className="editable-row" key={pair.id}>
                  <input
                    aria-label="Word"
                    onChange={(event) => updatePair(pair.id, "word", event.target.value)}
                    value={pair.word}
                  />
                  <input
                    aria-label="Definition"
                    onChange={(event) =>
                      updatePair(pair.id, "definition", event.target.value)
                    }
                    value={pair.definition}
                  />
                  <input
                    aria-label="Translation"
                    onChange={(event) =>
                      updatePair(pair.id, "translation", event.target.value)
                    }
                    placeholder="Translation"
                    value={pair.translation}
                  />
                  <input
                    aria-label="Custom right card"
                    onChange={(event) =>
                      updatePair(pair.id, "customRight", event.target.value)
                    }
                    placeholder="Custom right"
                    value={pair.customRight}
                  />
                </div>
              ))}
            </div>
            <button className="secondary-button" onClick={addPairRow} type="button">
              Add pair row
            </button>
          </>
        ) : null}

        {activeTab === "faces" ? (
          <>
            <h4>Pair type</h4>
            <div className="template-list">
              {memoryPairTypeOptions.map((option) => (
                <button
                  className={
                    settings.pairType === option.key
                      ? "template-option active"
                      : "template-option"
                  }
                  key={option.key}
                  onClick={() => updateSettings({ pairType: option.key })}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
            <div className="segmented">
              <button
                className={settings.duplicateMode === "single" ? "active" : ""}
                onClick={() => updateSettings({ duplicateMode: "single" })}
                type="button"
              >
                Single set
              </button>
              <button
                className={settings.duplicateMode === "double" ? "active" : ""}
                onClick={() => updateSettings({ duplicateMode: "double" })}
                type="button"
              >
                Duplicate set
              </button>
            </div>
            <button
              className={settings.showPairLabels ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showPairLabels: !settings.showPairLabels })}
              type="button"
            >
              Show pair labels
            </button>
          </>
        ) : null}

        {activeTab === "back" ? (
          <>
            <ColorPalette
              colors={frameColors}
              label="Back"
              selectedColor={settings.backColor}
              onSelect={(backColor) => updateSettings({ backColor })}
            />
            <ColorPalette
              colors={backgroundColors}
              label="Pattern"
              selectedColor={settings.backPatternColor}
              onSelect={(backPatternColor) => updateSettings({ backPatternColor })}
            />
            <h4>Pattern</h4>
            <div className="segmented four">
              {memoryBackPatternOptions.map((option) => (
                <button
                  className={settings.backPattern === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ backPattern: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              className={settings.showBackLogo ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ showBackLogo: !settings.showBackLogo })}
              type="button"
            >
              Show back logo placeholder
            </button>
          </>
        ) : null}

        {activeTab === "page" ? (
          <>
            <h4>Cards per page</h4>
            <div className="segmented four">
              {memoryCardsPerPageOptions.map((count) => (
                <button
                  className={settings.cardsPerPage === count ? "active" : ""}
                  key={count}
                  onClick={() => updateSettings({ cardsPerPage: count })}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
            <h4>Card size</h4>
            <div className="segmented three">
              {memoryCardSizeOptions.map((option) => (
                <button
                  className={settings.cardSize === option.key ? "active" : ""}
                  key={option.key}
                  onClick={() => updateSettings({ cardSize: option.key })}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <h4>Sheet</h4>
            <div className="segmented">
              <button
                className={settings.orientation === "portrait" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "portrait" })}
                type="button"
              >
                Portrait
              </button>
              <button
                className={settings.orientation === "landscape" ? "active" : ""}
                onClick={() => updateSettings({ orientation: "landscape" })}
                type="button"
              >
                Landscape
              </button>
            </div>
          </>
        ) : null}

        {activeTab === "answer" ? (
          <>
            <button
              className={settings.showTeacherGuide ? "toggle-row active" : "toggle-row"}
              onClick={() =>
                updateSettings({ showTeacherGuide: !settings.showTeacherGuide })
              }
              type="button"
            >
              Include teacher guide
            </button>
            <button
              className={settings.cutLines ? "toggle-row active" : "toggle-row"}
              onClick={() => updateSettings({ cutLines: !settings.cutLines })}
              type="button"
            >
              Show cut lines
            </button>
          </>
        ) : null}
      </div>
    </div>
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

function buildDefaultQuizQuestions(items: VocabularySet["items"]): QuizQuestion[] {
  return items.map((item, index) => {
    if (index % 3 === 1) {
      return {
        id: `quiz-${item.id}`,
        prompt: `True or false: "${item.word}" means "${item.definition}"`,
        type: "true-false",
        choices: ["True", "False"],
        correctAnswer: "True",
        points: 1,
      };
    }

    if (index % 3 === 2) {
      return {
        id: `quiz-${item.id}`,
        prompt: `Write one sentence using "${item.word}".`,
        type: "short-answer",
        choices: [],
        correctAnswer: item.example,
        points: 2,
      };
    }

    const distractors = items
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => candidate.definition)
      .filter(Boolean);
    const choices = uniqueStrings([
      item.definition,
      ...distractors,
      "To make a sound.",
      "A place in the classroom.",
    ]).slice(0, 4);

    return {
      id: `quiz-${item.id}`,
      prompt: `What does "${item.word}" mean?`,
      type: "multiple-choice",
      choices,
      correctAnswer: item.definition,
      points: 1,
    };
  });
}

function buildQuizBulkText(questions: QuizQuestion[]) {
  return questions
    .map((question) =>
      [
        quoteCsvCell(question.prompt),
        question.type,
        question.points,
        quoteCsvCell(question.choices.join("|")),
        quoteCsvCell(question.correctAnswer),
      ].join(","),
    )
    .join("\n");
}

function parseQuizBulkText(text: string, fallbackQuestions: QuizQuestion[]) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [
        prompt = "",
        typeCell = "multiple-choice",
        pointsCell = "1",
        choicesCell = "",
        answerCell = "",
      ] = parseCsvLine(line);
      const type = parseQuizQuestionType(typeCell);
      const fallbackQuestion = fallbackQuestions[index];
      const rawChoices = splitQuizChoices(choicesCell);
      const choices = getDefaultQuizChoices(
        type,
        rawChoices.length > 0 ? rawChoices : fallbackQuestion?.choices,
      );
      const points = Math.max(0, Number(pointsCell) || fallbackQuestion?.points || 1);

      return {
        id: `quiz-bulk-${index}-${slugifyId(prompt || "question")}`,
        prompt,
        type,
        choices,
        correctAnswer: getDefaultQuizAnswer(
          type,
          choices,
          answerCell || fallbackQuestion?.correctAnswer,
        ),
        points,
      };
    })
    .filter((question) => question.prompt);
}

function parseQuizQuestionType(value: string): QuizQuestionType {
  const normalized = value.toLowerCase().replace(/[_\s]+/g, "-");

  if (normalized === "true-false" || normalized === "tf" || normalized === "true/false") {
    return "true-false";
  }

  if (normalized === "short-answer" || normalized === "short" || normalized === "written") {
    return "short-answer";
  }

  return "multiple-choice";
}

function splitQuizChoices(value: string) {
  return value
    .split(/[|;\n]/)
    .map((choice) => choice.trim())
    .filter(Boolean);
}

function getDefaultQuizChoices(
  type: QuizQuestionType,
  existingChoices: string[] = [],
) {
  if (type === "true-false") {
    return ["True", "False"];
  }

  if (type === "short-answer") {
    return [];
  }

  const choices = uniqueStrings(existingChoices);
  return choices.length > 0
    ? choices
    : ["Option A", "Option B", "Option C", "Option D"];
}

function getDefaultQuizAnswer(
  type: QuizQuestionType,
  choices: string[],
  currentAnswer = "",
) {
  if (type === "true-false") {
    return currentAnswer === "False" ? "False" : "True";
  }

  if (type === "short-answer") {
    return currentAnswer;
  }

  return currentAnswer || choices[0] || "";
}

function orderQuizQuestionsForPreview(
  questions: QuizQuestion[],
  randomizeQuestions: boolean,
) {
  const filteredQuestions = questions.filter((question) => question.prompt.trim());

  if (!randomizeQuestions) {
    return filteredQuestions;
  }

  return [...filteredQuestions].sort(
    (first, second) => hashString(first.id) - hashString(second.id),
  );
}

function orderQuizChoicesForPreview(
  question: QuizQuestion,
  randomizeOptions: boolean,
) {
  if (question.type !== "multiple-choice" || !randomizeOptions) {
    return question.choices;
  }

  return [...question.choices].sort(
    (first, second) =>
      hashString(`${question.id}-${first}`) - hashString(`${question.id}-${second}`),
  );
}

function formatQuizQuestionNumber(index: number, style: QuizNumberingStyle) {
  if (style === "none") {
    return "";
  }

  if (style === "letters") {
    return `${String.fromCharCode(65 + index)}.`;
  }

  return `${index + 1}.`;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function quoteCsvCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function normalizeCrosswordWord(word: string) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function buildCrossword(
  entries: CrosswordEntry[],
  requestedSize: number,
  numbering: CrosswordNumbering,
): CrosswordBuildResult {
  const size = Math.max(8, Math.min(18, requestedSize));
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const cleanEntries = entries
    .map((entry) => ({ ...entry, cleanWord: normalizeCrosswordWord(entry.word) }))
    .filter((entry) => entry.cleanWord.length > 1);
  const placements: Omit<CrosswordPlacement, "number">[] = [];
  const skipped: CrosswordEntry[] = [];

  cleanEntries.forEach((entry, entryIndex) => {
    if (entry.cleanWord.length > size) {
      skipped.push(entry);
      return;
    }

    const placement =
      entryIndex === 0
        ? getFirstCrosswordPlacement(entry, size)
        : findIntersectingCrosswordPlacement(entry, placements, grid) ??
          findFallbackCrosswordPlacement(entry, grid);

    if (!placement) {
      skipped.push(entry);
      return;
    }

    writeCrosswordPlacement(grid, placement);
    placements.push(placement);
  });

  const numbers = numberCrosswordPlacements(placements, numbering);
  const numberedPlacements = placements.map((placement, index) => ({
    ...placement,
    number:
      numbering === "entry-order"
        ? index + 1
        : numbers.get(`${placement.row}:${placement.col}`) ?? index + 1,
  }));

  return { grid, placements: numberedPlacements, skipped, numbers };
}

function getFirstCrosswordPlacement(
  entry: CrosswordEntry & { cleanWord: string },
  size: number,
): Omit<CrosswordPlacement, "number"> {
  return {
    ...entry,
    col: Math.max(0, Math.floor((size - entry.cleanWord.length) / 2)),
    direction: "across",
    row: Math.floor(size / 2),
  };
}

function findIntersectingCrosswordPlacement(
  entry: CrosswordEntry & { cleanWord: string },
  placements: Omit<CrosswordPlacement, "number">[],
  grid: (string | null)[][],
) {
  let bestPlacement: Omit<CrosswordPlacement, "number"> | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  const size = grid.length;
  const center = (size - 1) / 2;

  placements.forEach((placed) => {
    for (let placedIndex = 0; placedIndex < placed.cleanWord.length; placedIndex += 1) {
      for (let entryIndex = 0; entryIndex < entry.cleanWord.length; entryIndex += 1) {
        if (placed.cleanWord[placedIndex] !== entry.cleanWord[entryIndex]) {
          continue;
        }

        const direction: CrosswordDirection =
          placed.direction === "across" ? "down" : "across";
        const row =
          placed.direction === "across"
            ? placed.row - entryIndex
            : placed.row + placedIndex;
        const col =
          placed.direction === "across"
            ? placed.col + placedIndex
            : placed.col - entryIndex;
        const candidate = { ...entry, row, col, direction };

        if (!canPlaceCrosswordEntry(grid, candidate)) {
          continue;
        }

        const intersections = countCrosswordIntersections(grid, candidate);
        const distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
        const score = intersections * 100 - distanceFromCenter;

        if (score > bestScore) {
          bestScore = score;
          bestPlacement = candidate;
        }
      }
    }
  });

  return bestPlacement;
}

function findFallbackCrosswordPlacement(
  entry: CrosswordEntry & { cleanWord: string },
  grid: (string | null)[][],
) {
  const directions: CrosswordDirection[] = ["across", "down"];

  for (const direction of directions) {
    for (let row = 0; row < grid.length; row += 1) {
      for (let col = 0; col < grid.length; col += 1) {
        const candidate = { ...entry, row, col, direction };

        if (canPlaceCrosswordEntry(grid, candidate)) {
          return candidate;
        }
      }
    }
  }

  return null;
}

function canPlaceCrosswordEntry(
  grid: (string | null)[][],
  placement: Omit<CrosswordPlacement, "number">,
) {
  const rowStep = placement.direction === "down" ? 1 : 0;
  const colStep = placement.direction === "across" ? 1 : 0;
  const endRow = placement.row + rowStep * (placement.cleanWord.length - 1);
  const endCol = placement.col + colStep * (placement.cleanWord.length - 1);

  if (
    placement.row < 0 ||
    placement.col < 0 ||
    endRow < 0 ||
    endCol < 0 ||
    endRow >= grid.length ||
    endCol >= grid.length
  ) {
    return false;
  }

  for (let index = 0; index < placement.cleanWord.length; index += 1) {
    const row = placement.row + rowStep * index;
    const col = placement.col + colStep * index;
    const existingLetter = grid[row][col];

    if (existingLetter !== null && existingLetter !== placement.cleanWord[index]) {
      return false;
    }
  }

  return true;
}

function countCrosswordIntersections(
  grid: (string | null)[][],
  placement: Omit<CrosswordPlacement, "number">,
) {
  const rowStep = placement.direction === "down" ? 1 : 0;
  const colStep = placement.direction === "across" ? 1 : 0;
  let intersections = 0;

  for (let index = 0; index < placement.cleanWord.length; index += 1) {
    const row = placement.row + rowStep * index;
    const col = placement.col + colStep * index;

    if (grid[row][col] === placement.cleanWord[index]) {
      intersections += 1;
    }
  }

  return intersections;
}

function writeCrosswordPlacement(
  grid: (string | null)[][],
  placement: Omit<CrosswordPlacement, "number">,
) {
  const rowStep = placement.direction === "down" ? 1 : 0;
  const colStep = placement.direction === "across" ? 1 : 0;

  for (let index = 0; index < placement.cleanWord.length; index += 1) {
    const row = placement.row + rowStep * index;
    const col = placement.col + colStep * index;
    grid[row][col] = placement.cleanWord[index];
  }
}

function numberCrosswordPlacements(
  placements: Omit<CrosswordPlacement, "number">[],
  numbering: CrosswordNumbering,
) {
  if (numbering === "entry-order") {
    return new Map(
      placements.map((placement, index) => [`${placement.row}:${placement.col}`, index + 1]),
    );
  }

  return new Map(
    Array.from(new Set(placements.map((placement) => `${placement.row}:${placement.col}`)))
      .map((key) => {
        const [row, col] = key.split(":").map(Number);
        return { key, row, col };
      })
      .sort((first, second) => first.row - second.row || first.col - second.col)
      .map((start, index) => [start.key, index + 1]),
  );
}

function slugifyId(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "item"
  );
}

function generateWordSearchGrid(
  words: string[],
  size: number,
  directions: Record<WordSearchDirection, boolean>,
): WordSearchPuzzle {
  const letters: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const answers = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false),
  );
  const vectors = getEnabledDirectionVectors(directions);
  const normalizedWords = words
    .map((word) => normalizeWordForPuzzle(word).slice(0, size))
    .filter((word) => word.length > 1)
    .slice(0, 18);
  const seed = hashString(normalizedWords.join("|") || "MYOWNMATERIALS");
  const placedWords: string[] = [];
  const skippedWords: string[] = [];

  normalizedWords.forEach((word, wordIndex) => {
    const wordHash = hashString(`${word}-${wordIndex}`);
    const maxAttempts = size * size * vectors.length;
    let placed = false;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const vector = vectors[(wordHash + wordIndex + attempt) % vectors.length];
      const positionSeed = wordHash + attempt * 37 + wordIndex * 53;
      const row = positiveModulo(positionSeed + attempt * 3, size);
      const col = positiveModulo(Math.floor(positionSeed / size) + attempt * 5, size);

      if (canPlaceWord(letters, word, row, col, vector.row, vector.col)) {
        placeWord(letters, answers, word, row, col, vector.row, vector.col);
        placedWords.push(word);
        placed = true;
        break;
      }
    }

    if (!placed) {
      skippedWords.push(word);
    }
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const cells = letters.map((row, rowIndex) =>
    row.map((letter, colIndex) => ({
      col: colIndex,
      isAnswer: answers[rowIndex][colIndex],
      letter:
        letter ??
        alphabet[
          positiveModulo(seed + rowIndex * 11 + colIndex * 17 + rowIndex * colIndex, 26)
        ],
      row: rowIndex,
    })),
  );

  return { cells, placedWords, skippedWords };
}

function normalizeWordForPuzzle(word: string) {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function getEnabledDirectionVectors(directions: Record<WordSearchDirection, boolean>) {
  const vectors: { col: number; row: number }[] = [];

  if (directions.horizontal) {
    vectors.push({ col: 1, row: 0 });
  }

  if (directions.vertical) {
    vectors.push({ col: 0, row: 1 });
  }

  if (directions.diagonal) {
    vectors.push({ col: 1, row: 1 });
  }

  if (directions.backwards) {
    vectors.push({ col: -1, row: 0 }, { col: 0, row: -1 }, { col: -1, row: -1 });
  }

  return vectors.length > 0 ? vectors : [{ col: 1, row: 0 }];
}

function canPlaceWord(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  rowStep: number,
  colStep: number,
) {
  const size = grid.length;
  const endRow = row + rowStep * (word.length - 1);
  const endCol = col + colStep * (word.length - 1);

  if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
    return false;
  }

  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + rowStep * index;
    const nextCol = col + colStep * index;
    const existingLetter = grid[nextRow][nextCol];

    if (existingLetter !== null && existingLetter !== word[index]) {
      return false;
    }
  }

  return true;
}

function placeWord(
  grid: (string | null)[][],
  answers: boolean[][],
  word: string,
  row: number,
  col: number,
  rowStep: number,
  colStep: number,
) {
  for (let index = 0; index < word.length; index += 1) {
    const nextRow = row + rowStep * index;
    const nextCol = col + colStep * index;
    grid[nextRow][nextCol] = word[index];
    answers[nextRow][nextCol] = true;
  }
}

function hashString(value: string) {
  return value.split("").reduce((hash, char) => {
    return positiveModulo(hash * 31 + char.charCodeAt(0), 2147483647);
  }, 7);
}

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

function buildBingoBoard(
  items: EditableVocabularyItem[],
  settings: BingoSettings,
  boardIndex = 0,
): BingoBoardCell[] {
  const usableItems = items.filter((item) => item.word.trim());
  const cellsCount = settings.boardSize * settings.boardSize;
  const freeIndex = settings.freeSpace
    ? Math.floor(settings.boardSize / 2) * settings.boardSize +
      Math.floor(settings.boardSize / 2)
    : -1;
  const orderedItems = settings.randomizeBoards
    ? deterministicShuffle(
        usableItems,
        `${settings.title}-${settings.boardSize}-${boardIndex}-${usableItems
          .map((item) => item.word)
          .join("|")}`,
      )
    : usableItems;

  let itemIndex = 0;

  return Array.from({ length: cellsCount }, (_, cellIndex) => {
    if (cellIndex === freeIndex) {
      return {
        assetId: "",
        id: "free-space",
        isFree: true,
        label: settings.freeSpaceLabel || "FREE",
        subLabel: "Free space",
      };
    }

    const sourceItem =
      orderedItems[itemIndex % Math.max(orderedItems.length, 1)] ?? items[0];
    itemIndex += 1;

    return {
      assetId: sourceItem?.assetId ?? "",
      id: sourceItem ? `${sourceItem.id}-${cellIndex}` : `empty-${cellIndex}`,
      isFree: false,
      label: sourceItem?.word || "Add item",
      subLabel: sourceItem?.definition || "Caller clue",
    };
  });
}

function deterministicShuffle<T>(items: T[], seedSource: string) {
  const shuffled = [...items];
  let seed = hashString(seedSource || "bingo");

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = positiveModulo(seed * 1103515245 + 12345, 2147483647);
    const swapIndex = positiveModulo(seed, index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getMatchingPreviewSides(
  pair: MatchingPair,
  matchMode: MatchingMode,
  index: number,
): { left: MatchingPreviewSide; right: MatchingPreviewSide } {
  const resolvedMode =
    matchMode === "mixed"
      ? (["word-definition", "image-word", "word-translation", "sentence-word"] as const)[
          index % 4
        ]
      : matchMode;
  const word = pair.word || "Word";
  const definition = pair.definition || `Definition for ${word}`;
  const translation = pair.translation || `Translation for ${word}`;
  const sentence = pair.sentence || `Example sentence for ${word}.`;
  const base = {
    assetId: pair.assetId,
    pairId: pair.id,
  };

  if (resolvedMode === "image-word") {
    return {
      left: { ...base, kind: "image", text: word },
      right: { ...base, kind: "word", text: word },
    };
  }

  if (resolvedMode === "word-translation") {
    return {
      left: { ...base, kind: "word", text: word },
      right: { ...base, kind: "translation", text: translation },
    };
  }

  if (resolvedMode === "sentence-word") {
    return {
      left: { ...base, kind: "sentence", text: sentence },
      right: { ...base, kind: "word", text: word },
    };
  }

  return {
    left: { ...base, kind: "word", text: word },
    right: { ...base, kind: "definition", text: definition },
  };
}

function orderMatchingPreviewSides<T extends MatchingPreviewSide>(
  items: T[],
  seed: string,
  shouldShuffle: boolean,
) {
  if (!shouldShuffle) {
    return items;
  }

  return [...items].sort((a, b) => {
    const aHash = hashString(`${seed}-${a.pairId}-${a.kind}`);
    const bHash = hashString(`${seed}-${b.pairId}-${b.kind}`);
    return aHash - bHash;
  });
}

function letterForIndex(index: number) {
  return String.fromCharCode(65 + positiveModulo(index, 26));
}

function getMemoryFaceKinds(pairType: MemoryPairType): [MemoryFaceKind, MemoryFaceKind] {
  if (pairType === "word-image") {
    return ["word", "image"];
  }

  if (pairType === "word-translation") {
    return ["word", "translation"];
  }

  if (pairType === "image-definition") {
    return ["image", "definition"];
  }

  if (pairType === "custom") {
    return ["custom", "custom"];
  }

  return ["word", "definition"];
}

function buildMemoryCards(
  pairs: MemoryPair[],
  settings: MemorySettings,
): MemoryCardPreviewItem[] {
  const faceKinds = getMemoryFaceKinds(settings.pairType);
  const usablePairs = pairs.filter(
    (pair) => pair.word.trim() || pair.definition.trim() || pair.customLeft.trim(),
  );
  const copyCount = settings.duplicateMode === "double" ? 2 : 1;
  const cards: MemoryCardPreviewItem[] = [];

  usablePairs.forEach((pair, pairIndex) => {
    const pairLabel = getMemoryPairLabel(pairIndex);

    for (let copyIndex = 0; copyIndex < copyCount; copyIndex += 1) {
      faceKinds.forEach((kind, faceIndex) => {
        const face = getMemoryFaceContent(pair, kind, faceIndex);
        cards.push({
          ...face,
          id: `${pair.id}-${copyIndex}-${faceIndex}`,
          pairLabel,
        });
      });
    }
  });

  if (!settings.shuffleCards) {
    return cards;
  }

  return [...cards].sort((first, second) => {
    const firstHash = hashString(`${settings.pairType}-${first.id}-${first.content}`);
    const secondHash = hashString(`${settings.pairType}-${second.id}-${second.content}`);

    return firstHash - secondHash;
  });
}

function getMemoryFaceContent(
  pair: MemoryPair,
  kind: MemoryFaceKind,
  faceIndex: number,
): Omit<MemoryCardPreviewItem, "id" | "pairLabel"> {
  if (kind === "image") {
    return {
      assetId: pair.assetId,
      content: pair.word || "Picture card",
      faceLabel: "Image",
      kind,
      subContent: pair.definition,
    };
  }

  if (kind === "definition") {
    return {
      assetId: pair.assetId,
      content: pair.definition || "Definition",
      faceLabel: "Definition",
      kind,
      subContent: pair.word,
    };
  }

  if (kind === "translation") {
    return {
      assetId: pair.assetId,
      content: pair.translation || "Translation",
      faceLabel: "Translation",
      kind,
      subContent: pair.word,
    };
  }

  if (kind === "custom") {
    return {
      assetId: pair.assetId,
      content:
        faceIndex === 0
          ? pair.customLeft || pair.word || "Custom A"
          : pair.customRight || pair.definition || "Custom B",
      faceLabel: faceIndex === 0 ? "Custom A" : "Custom B",
      kind,
      subContent: pair.word && pair.definition ? `${pair.word} / ${pair.definition}` : "",
    };
  }

  return {
    assetId: pair.assetId,
    content: pair.word || "Word",
    faceLabel: "Word",
    kind,
    subContent: pair.definition,
  };
}

function getMemoryPairLabel(index: number) {
  const letter = String.fromCharCode(65 + positiveModulo(index, 26));
  const suffix = index >= 26 ? String(Math.floor(index / 26) + 1) : "";

  return `${letter}${suffix}`;
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
  items,
  materialTitle,
  orientation,
  printSides,
  sheetSize,
}: {
  backSettings: FlashcardSideSettings;
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  frontSettings: FlashcardSideSettings;
  items: EditableVocabularyItem[];
  materialTitle: string;
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
        items={items}
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
          items={items}
          mirrorForBack
          orientation={orientation}
          settings={backSettings}
          sheetLabel="Back side"
          sheetSize={sheetSize}
        />
      ) : null}
      <div className="full-preview-note">
        <strong>{materialTitle}</strong>
        <span>Full document preview will be generated after configuration.</span>
      </div>
    </div>
  );
}

function CrosswordPreview({
  cluePlacement,
  design,
  entries,
  gridSize,
  includeAnswerKey,
  instructions,
  numbering,
  orientation,
  sheetSize,
  showWordBank,
  title,
  uppercase,
}: {
  cluePlacement: CrosswordCluePlacement;
  design: CrosswordDesignSettings;
  entries: CrosswordEntry[];
  gridSize: number;
  includeAnswerKey: boolean;
  instructions: string;
  numbering: CrosswordNumbering;
  orientation: Orientation;
  sheetSize: SheetSize;
  showWordBank: boolean;
  title: string;
  uppercase: boolean;
}) {
  const puzzle = useMemo(
    () => buildCrossword(entries, gridSize, numbering),
    [entries, gridSize, numbering],
  );
  const placedWords = puzzle.placements.map((placement) =>
    formatCrosswordDisplayWord(placement.cleanWord, uppercase),
  );

  return (
    <div className="sheet-preview-stack crossword-preview-stack">
      <section className={`crossword-page sheet-${sheetSize} ${orientation}`}>
        <div className="preview-side-label">
          <span>Worksheet preview</span>
          <small>
            {gridSize} x {gridSize} · {orientation}
          </small>
        </div>
        <article
          className={`crossword-sheet font-${design.fontStyle} density-${design.density} clues-${cluePlacement}`}
          style={
            {
              "--crossword-accent": design.accentColor,
              "--crossword-bg": design.backgroundColor,
              "--crossword-border": design.borderColor,
              "--crossword-cell": design.cellColor,
              "--crossword-grid-size": gridSize,
              "--crossword-text": design.textColor,
            } as React.CSSProperties
          }
        >
          <header className="crossword-header">
            <div>
              <p className="eyebrow">Crossword worksheet</p>
              <h2>{title || "Untitled crossword"}</h2>
            </div>
            <span>{puzzle.placements.length} placed</span>
          </header>
          {instructions.trim() ? (
            <p className="crossword-instructions">{instructions}</p>
          ) : null}

          <div className="crossword-workspace">
            <CrosswordGrid puzzle={puzzle} showAnswers={false} uppercase={uppercase} />
            <CrosswordClueList placements={puzzle.placements} />
          </div>

          {showWordBank && placedWords.length > 0 ? (
            <div className="crossword-word-bank">
              <strong>Word bank</strong>
              <div>
                {placedWords.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </div>
            </div>
          ) : null}

          {puzzle.skipped.length > 0 ? (
            <p className="crossword-warning">
              Not placed in this grid:{" "}
              {puzzle.skipped
                .map((entry) => formatCrosswordDisplayWord(entry.word, uppercase))
                .join(", ")}
            </p>
          ) : null}
        </article>
      </section>

      {includeAnswerKey ? (
        <section className={`crossword-page answer-page sheet-${sheetSize} ${orientation}`}>
          <div className="preview-side-label">
            <span>Answer key</span>
            <small>{puzzle.placements.length} answer(s)</small>
          </div>
          <article
            className={`crossword-sheet answer-key font-${design.fontStyle} density-${design.density}`}
            style={
              {
                "--crossword-accent": design.accentColor,
                "--crossword-bg": design.backgroundColor,
                "--crossword-border": design.borderColor,
                "--crossword-cell": design.cellColor,
                "--crossword-grid-size": gridSize,
                "--crossword-text": design.textColor,
              } as React.CSSProperties
            }
          >
            <header className="crossword-header">
              <div>
                <p className="eyebrow">Teacher copy</p>
                <h2>{title || "Untitled crossword"} answers</h2>
              </div>
              <span>Key</span>
            </header>
            <div className="crossword-workspace clues-below">
              <CrosswordGrid puzzle={puzzle} showAnswers uppercase={uppercase} />
              <CrosswordAnswerList placements={puzzle.placements} uppercase={uppercase} />
            </div>
          </article>
        </section>
      ) : null}
    </div>
  );
}

function CrosswordGrid({
  puzzle,
  showAnswers,
  uppercase,
}: {
  puzzle: CrosswordBuildResult;
  showAnswers: boolean;
  uppercase: boolean;
}) {
  return (
    <div className="crossword-grid" role="grid" aria-label="Crossword grid">
      {puzzle.grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => {
          const number = puzzle.numbers.get(`${rowIndex}:${colIndex}`);

          return (
            <span
              aria-label={
                letter
                  ? `Row ${rowIndex + 1}, column ${colIndex + 1}`
                  : `Blocked cell row ${rowIndex + 1}, column ${colIndex + 1}`
              }
              className={letter ? "crossword-cell" : "crossword-cell blocked"}
              key={`${rowIndex}-${colIndex}`}
              role="gridcell"
            >
              {number && letter ? <small>{number}</small> : null}
              {showAnswers && letter ? (
                <b>{formatCrosswordDisplayWord(letter, uppercase)}</b>
              ) : null}
            </span>
          );
        }),
      )}
    </div>
  );
}

function CrosswordClueList({ placements }: { placements: CrosswordPlacement[] }) {
  const across = placements
    .filter((placement) => placement.direction === "across")
    .sort(sortCrosswordPlacements);
  const down = placements
    .filter((placement) => placement.direction === "down")
    .sort(sortCrosswordPlacements);

  return (
    <div className="crossword-clues">
      <CrosswordClueGroup label="Across" placements={across} />
      <CrosswordClueGroup label="Down" placements={down} />
    </div>
  );
}

function CrosswordClueGroup({
  label,
  placements,
}: {
  label: string;
  placements: CrosswordPlacement[];
}) {
  return (
    <section>
      <h3>{label}</h3>
      {placements.length > 0 ? (
        <ol>
          {placements.map((placement) => (
            <li key={`${label}-${placement.id}-${placement.number}`}>
              <strong>{placement.number}.</strong>
              <span>{placement.clue || `Clue for ${placement.word}`}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>No {label.toLowerCase()} words placed yet.</p>
      )}
    </section>
  );
}

function CrosswordAnswerList({
  placements,
  uppercase,
}: {
  placements: CrosswordPlacement[];
  uppercase: boolean;
}) {
  return (
    <div className="crossword-answer-list">
      {[...placements].sort(sortCrosswordPlacements).map((placement) => (
        <span key={`answer-${placement.id}-${placement.number}`}>
          <strong>{placement.number}.</strong>{" "}
          {formatCrosswordDisplayWord(placement.cleanWord, uppercase)}
        </span>
      ))}
    </div>
  );
}

function sortCrosswordPlacements(first: CrosswordPlacement, second: CrosswordPlacement) {
  return first.number - second.number || first.row - second.row || first.col - second.col;
}

function formatCrosswordDisplayWord(word: string, uppercase: boolean) {
  return uppercase ? word.toUpperCase() : word.toLowerCase();
}

function WordSearchPreview({
  items,
  materialTitle,
  settings,
}: {
  items: EditableVocabularyItem[];
  materialTitle: string;
  settings: WordSearchSettings;
}) {
  const previewItems = useMemo(
    () => items.filter((item) => item.word.trim()).slice(0, 16),
    [items],
  );
  const puzzle = useMemo(
    () =>
      generateWordSearchGrid(
        previewItems.map((item) => item.word),
        settings.gridSize,
        settings.directions,
      ),
    [previewItems, settings.directions, settings.gridSize],
  );
  const displayLetter = (letter: string) =>
    settings.letterCase === "lowercase" ? letter.toLowerCase() : letter;
  const shownWords = previewItems.map((item) => item.word.trim()).filter(Boolean);

  return (
    <div className="sheet-preview-stack word-search-preview-stack">
      <section className={`word-search-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Worksheet preview</span>
          <small>
            {settings.gridSize} x {settings.gridSize} · {settings.difficulty}
          </small>
        </div>
        <article
          className={`word-search-sheet font-${settings.fontStyle} answer-${settings.highlightStyle}`}
          style={
            {
              "--word-search-accent": settings.accentColor,
              "--word-search-bg": settings.backgroundColor,
              "--word-search-border": settings.borderColor,
              "--word-search-grid-size": settings.gridSize,
              "--word-search-text": settings.textColor,
            } as React.CSSProperties
          }
        >
          <header className="word-search-header">
            <div>
              <p className="eyebrow">Sopa de letras</p>
              <h2>{materialTitle}</h2>
              <p>{settings.instructions}</p>
            </div>
            <span>{settings.sheetSize.toUpperCase()}</span>
          </header>

          {settings.includePictureHints ? (
            <div className="word-search-picture-hints" aria-label="Picture hints">
              {previewItems.slice(0, 4).map((item) => {
                const asset = getAsset(item.assetId);

                return asset ? (
                  <div className="picture-hint" key={`${item.id}-hint`}>
                    <Image
                      src={asset.imageUrl}
                      alt={asset.alt}
                      fill
                      sizes="90px"
                      style={{ objectFit: "cover" }}
                    />
                    <span>{item.word}</span>
                  </div>
                ) : null;
              })}
            </div>
          ) : null}

          <div className="word-search-body">
            <div
              className="word-search-grid"
              aria-label={`${settings.gridSize} by ${settings.gridSize} word search grid`}
            >
              {puzzle.cells.flat().map((cell) => (
                <span
                  className={
                    settings.includeAnswerKey && cell.isAnswer
                      ? "word-search-cell answer"
                      : "word-search-cell"
                  }
                  key={`${cell.row}-${cell.col}`}
                >
                  {displayLetter(cell.letter)}
                </span>
              ))}
            </div>

            {settings.showWordBank ? (
              <aside className="word-search-bank">
                <h3>Word bank</h3>
                <div>
                  {shownWords.map((word) => (
                    <span key={word}>
                      {settings.letterCase === "lowercase"
                        ? word.toLowerCase()
                        : word.toUpperCase()}
                    </span>
                  ))}
                </div>
              </aside>
            ) : null}
          </div>

          <div
            className={
              settings.includeAnswerKey
                ? "word-search-answer-note"
                : "word-search-answer-note muted"
            }
          >
            <strong>
              {settings.includeAnswerKey ? "Teacher answer key visible" : "Student copy"}
            </strong>
            <span>
              {puzzle.placedWords.length} placed
              {puzzle.skippedWords.length > 0
                ? ` · ${puzzle.skippedWords.length} too long or blocked`
                : ""}
            </span>
          </div>
        </article>
      </section>
      <div className="full-preview-note">
        <strong>{materialTitle}</strong>
        <span>
          Deterministic preview updates from the word list, grid size, directions, and
          answer-key settings.
        </span>
      </div>
    </div>
  );
}

function BingoPreview({
  items,
  settings,
}: {
  items: EditableVocabularyItem[];
  settings: BingoSettings;
}) {
  const previewItems = useMemo(
    () => items.filter((item) => item.word.trim()).slice(0, 36),
    [items],
  );
  const boardCells = useMemo(
    () => buildBingoBoard(previewItems, settings, 0),
    [previewItems, settings],
  );
  const callerItems = previewItems.slice(0, 18);

  return (
    <div className="sheet-preview-stack bingo-preview-stack">
      <section className={`bingo-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Bingo board preview</span>
          <small>
            {settings.boardSize} x {settings.boardSize} · {settings.boardCount} boards
          </small>
        </div>
        <article
          className={`bingo-sheet font-${settings.fontStyle} cards-${settings.cardsPerPage} ${
            settings.cutLines ? "with-cut-lines" : ""
          }`}
          style={
            {
              "--bingo-accent": settings.accentColor,
              "--bingo-bg": settings.backgroundColor,
              "--bingo-border": settings.borderColor,
              "--bingo-grid-size": settings.boardSize,
              "--bingo-text": settings.textColor,
            } as React.CSSProperties
          }
        >
          <header className="bingo-header">
            <div>
              <p className="eyebrow">Vocabulary bingo</p>
              <h2>{settings.title}</h2>
              <p>{settings.headerInstructions}</p>
            </div>
            <div className="bingo-meta">
              <span>{settings.sheetSize.toUpperCase()}</span>
              <span>{settings.orientation}</span>
            </div>
          </header>

          <div className="bingo-main">
            <div
              className="bingo-board"
              aria-label={`${settings.boardSize} by ${settings.boardSize} bingo board`}
            >
              {boardCells.map((cell) => {
                const asset = getAsset(cell.assetId);
                const imageAsset =
                  !cell.isFree &&
                  asset &&
                  (settings.displayMode === "images" ||
                    settings.displayMode === "both")
                    ? asset
                    : null;
                const showLabel =
                  cell.isFree ||
                  settings.displayMode === "words" ||
                  settings.displayMode === "both" ||
                  !asset;

                return (
                  <div
                    className={cell.isFree ? "bingo-cell free" : "bingo-cell"}
                    key={cell.id}
                  >
                    {imageAsset ? (
                      <div className="bingo-cell-image">
                        <Image
                          src={imageAsset.imageUrl}
                          alt={imageAsset.alt}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : null}
                    {showLabel ? <strong>{cell.label}</strong> : null}
                    {settings.displayMode === "both" && !cell.isFree ? (
                      <small>{cell.subLabel}</small>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {settings.showItemBank ? (
              <aside className="bingo-item-bank">
                <h3>Item bank</h3>
                <div>
                  {callerItems.slice(0, 12).map((item) => (
                    <span key={`${item.id}-bank`}>{item.word}</span>
                  ))}
                </div>
              </aside>
            ) : null}
          </div>

          <footer className="bingo-footer">
            <p>{settings.footerInstructions}</p>
            <span>
              Sample board 1 of {settings.boardCount} ·{" "}
              {settings.randomizeBoards ? "randomized" : "list order"}
            </span>
          </footer>

          {settings.includeCallList || settings.includeCallerCards ? (
            <section className="bingo-caller-section">
              {settings.includeCallList ? (
                <div className="bingo-call-list">
                  <h3>Call list</h3>
                  <ol>
                    {callerItems.slice(0, 10).map((item) => (
                      <li key={`${item.id}-call-list`}>{item.word}</li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {settings.includeCallerCards ? (
                <div className="bingo-caller-cards">
                  <h3>Caller cards</h3>
                  <div>
                    {callerItems.slice(0, 8).map((item) => {
                      const asset = getAsset(item.assetId);

                      return (
                        <article key={`${item.id}-caller-card`}>
                          {asset ? (
                            <div>
                              <Image
                                src={asset.imageUrl}
                                alt={asset.alt}
                                fill
                                sizes="80px"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ) : null}
                          <strong>{item.word}</strong>
                          <small>{item.definition || "Call this item"}</small>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </article>
      </section>
      <div className="full-preview-note">
        <strong>{settings.title}</strong>
        <span>
          Deterministic preview uses the current item list, board size, randomization,
          free-space, display, caller-card, and page settings.
        </span>
      </div>
    </div>
  );
}

function QuizPreview({
  materialTitle,
  questions,
  settings,
}: {
  materialTitle: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
}) {
  const previewQuestions = useMemo(
    () => orderQuizQuestionsForPreview(questions, settings.randomizeQuestions).slice(0, 5),
    [questions, settings.randomizeQuestions],
  );
  const totalPreviewPoints = previewQuestions.reduce(
    (sum, question) => sum + question.points,
    0,
  );

  return (
    <div className="sheet-preview-stack quiz-preview-stack">
      <section className={`quiz-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Quiz preview</span>
          <small>
            {settings.sheetSize.toUpperCase()} · {settings.orientation}
          </small>
        </div>
        <article
          className={`quiz-sheet font-${settings.fontStyle} spacing-${settings.questionSpacing}`}
          style={
            {
              "--quiz-accent": settings.accentColor,
              "--quiz-bg": settings.backgroundColor,
              "--quiz-border": settings.borderColor,
              "--quiz-text": settings.textColor,
            } as React.CSSProperties
          }
        >
          <header className="quiz-header">
            <div>
              <p className="eyebrow">Printable quiz</p>
              <h2>{materialTitle}</h2>
              <p>{settings.instructions}</p>
            </div>
            <div className="quiz-meta">
              <span>Name</span>
              <i />
              <span>{totalPreviewPoints} pts shown</span>
            </div>
          </header>

          <div className="quiz-question-list">
            {previewQuestions.map((question, index) => {
              const numberLabel = formatQuizQuestionNumber(
                index,
                settings.numberingStyle,
              );
              const choices = orderQuizChoicesForPreview(
                question,
                settings.randomizeOptions,
              );

              return (
                <article className="quiz-preview-question" key={question.id}>
                  <div className="quiz-question-topline">
                    <h3>
                      {numberLabel ? <span>{numberLabel}</span> : null}
                      {question.prompt}
                    </h3>
                    {settings.showScoreBoxes ? (
                      <strong>{question.points} pt{question.points === 1 ? "" : "s"}</strong>
                    ) : null}
                  </div>

                  {question.type === "multiple-choice" ? (
                    <div className="quiz-choice-list">
                      {choices.map((choice, choiceIndex) => (
                        <label key={`${question.id}-${choice}`}>
                          <span>{String.fromCharCode(65 + choiceIndex)}</span>
                          <i />
                          <em>{choice}</em>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {question.type === "true-false" ? (
                    <div className="quiz-true-false-row">
                      <span>True</span>
                      <i />
                      <span>False</span>
                      <i />
                    </div>
                  ) : null}

                  {question.type === "short-answer" ? (
                    <div className="quiz-written-lines">
                      {Array.from({ length: settings.writtenAnswerLines }).map(
                        (_, lineIndex) => (
                          <i key={`${question.id}-line-${lineIndex}`} />
                        ),
                      )}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          {settings.showAnswerKey ? (
            <aside className="quiz-answer-key-preview">
              <h3>Answer key</h3>
              <div>
                {previewQuestions.map((question, index) => (
                  <span key={`${question.id}-key`}>
                    <strong>{formatQuizQuestionNumber(index, settings.numberingStyle)}</strong>
                    {question.correctAnswer || "No answer"}
                  </span>
                ))}
              </div>
            </aside>
          ) : null}
        </article>
      </section>
      <div className="full-preview-note">
        <strong>{materialTitle}</strong>
        <span>
          Preview shows up to five questions from the bank; the full printable quiz would
          include every configured question.
        </span>
      </div>
    </div>
  );
}

type MatchingPreviewSide = {
  assetId: string;
  kind: "word" | "definition" | "translation" | "sentence" | "image";
  pairId: string;
  text: string;
};

function MatchingPreview({
  pairs,
  settings,
  title,
}: {
  pairs: MatchingPair[];
  settings: MatchingSettings;
  title: string;
}) {
  const previewPairs = useMemo(
    () =>
      pairs
        .filter(
          (pair) =>
            pair.word.trim() ||
            pair.definition.trim() ||
            pair.translation.trim() ||
            pair.sentence.trim(),
        )
        .slice(0, Math.min(settings.pairsPerPage, 8)),
    [pairs, settings.pairsPerPage],
  );
  const previewSides = useMemo(
    () =>
      previewPairs.map((pair, index) => ({
        pair,
        ...getMatchingPreviewSides(pair, settings.matchMode, index),
      })),
    [previewPairs, settings.matchMode],
  );
  const leftItems = useMemo(
    () =>
      orderMatchingPreviewSides(
        previewSides.map((item) => item.left),
        `${title}-${settings.matchMode}-left`,
        settings.shuffleLeft,
      ),
    [previewSides, settings.matchMode, settings.shuffleLeft, title],
  );
  const rightItems = useMemo(
    () =>
      orderMatchingPreviewSides(
        previewSides.map((item) => item.right),
        `${title}-${settings.matchMode}-right`,
        settings.shuffleRight,
      ),
    [previewSides, settings.matchMode, settings.shuffleRight, title],
  );
  const rightLetterByPair = useMemo(() => {
    const letters = new Map<string, string>();
    rightItems.forEach((item, index) => letters.set(item.pairId, letterForIndex(index)));
    return letters;
  }, [rightItems]);
  const modeLabel =
    matchingModeOptions.find((option) => option.key === settings.matchMode)?.label ??
    "Matching";

  return (
    <div className="sheet-preview-stack matching-preview-stack">
      <section className={`matching-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Matching preview</span>
          <small>
            {settings.outputStyle === "cut-out-cards" ? "cut-out cards" : "worksheet"} ·{" "}
            {settings.orientation}
          </small>
        </div>
        <article
          className={[
            "matching-sheet",
            `font-${settings.fontStyle}`,
            `matching-${settings.outputStyle}`,
            `columns-${settings.columns}`,
            `spacing-${settings.spacing}`,
            `line-${settings.lineStyle}`,
          ].join(" ")}
          style={
            {
              "--matching-accent": settings.accentColor,
              "--matching-bg": settings.backgroundColor,
              "--matching-border": settings.borderColor,
              "--matching-text": settings.textColor,
            } as React.CSSProperties
          }
        >
          <header className="matching-header">
            <div>
              <p className="eyebrow">{modeLabel}</p>
              <h2>{title}</h2>
              <p>{settings.instructions}</p>
            </div>
            <span>{settings.sheetSize.toUpperCase()}</span>
          </header>

          {settings.outputStyle === "worksheet-lines" ? (
            <div className="matching-columns" aria-label="Matching worksheet columns">
              <div className="matching-choice-column">
                {leftItems.map((item, index) => (
                  <MatchingChoiceCard
                    item={item}
                    key={`left-${item.pairId}`}
                    label={settings.includeNumbering ? `${index + 1}` : undefined}
                    settings={settings}
                  />
                ))}
              </div>
              <div className="matching-line-column" aria-hidden="true">
                {leftItems.map((item) => (
                  <span key={`line-${item.pairId}`} />
                ))}
              </div>
              <div className="matching-choice-column">
                {rightItems.map((item, index) => (
                  <MatchingChoiceCard
                    item={item}
                    key={`right-${item.pairId}`}
                    label={settings.includeNumbering ? letterForIndex(index) : undefined}
                    settings={settings}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="matching-card-grid" aria-label="Cut-out matching cards">
              {[...leftItems, ...rightItems].map((item, index) => (
                <MatchingChoiceCard
                  item={item}
                  key={`${item.kind}-${item.pairId}-${index}`}
                  label={
                    settings.includeNumbering
                      ? index < leftItems.length
                        ? `${index + 1}`
                        : letterForIndex(index - leftItems.length)
                      : undefined
                  }
                  settings={settings}
                />
              ))}
            </div>
          )}

          {settings.showAnswerKey ? (
            <aside className="matching-answer-key">
              <strong>Answer key</strong>
              <div>
                {leftItems.map((item, index) => (
                  <span key={`answer-${item.pairId}`}>
                    {index + 1}-{rightLetterByPair.get(item.pairId) ?? "?"}
                  </span>
                ))}
              </div>
            </aside>
          ) : (
            <div className="matching-answer-key muted">Student copy - answer key hidden</div>
          )}
        </article>
      </section>
      <div className="full-preview-note">
        <strong>{title}</strong>
        <span>
          Preview uses the first {previewPairs.length} pair(s), deterministic shuffling,
          and the current matching mode, layout, and design settings.
        </span>
      </div>
    </div>
  );
}

function MatchingChoiceCard({
  item,
  label,
  settings,
}: {
  item: MatchingPreviewSide;
  label?: string;
  settings: MatchingSettings;
}) {
  const asset = item.assetId ? getAsset(item.assetId) : undefined;
  const showImage =
    settings.includeImages &&
    asset &&
    (item.kind === "image" || item.kind === "word" || item.kind === "translation");

  return (
    <div className={`matching-choice-card kind-${item.kind}`}>
      {label ? <span className="matching-choice-label">{label}</span> : null}
      {showImage && asset ? (
        <div className={item.kind === "image" ? "matching-card-image" : "matching-card-thumb"}>
          <Image
            src={asset.imageUrl}
            alt={asset.alt}
            fill
            sizes="(max-width: 900px) 120px, 180px"
            style={{ objectFit: "cover" }}
          />
        </div>
      ) : null}
      <p>{item.text}</p>
    </div>
  );
}

function MemoryPreview({
  pairs,
  settings,
}: {
  pairs: MemoryPair[];
  settings: MemorySettings;
}) {
  const cards = useMemo(() => buildMemoryCards(pairs, settings), [pairs, settings]);
  const previewCards = cards.slice(0, Math.min(cards.length, settings.cardsPerPage));
  const pairCount = pairs.filter(
    (pair) => pair.word.trim() || pair.definition.trim() || pair.customLeft.trim(),
  ).length;

  return (
    <div className="sheet-preview-stack memory-preview-stack">
      <section className={`memory-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Card fronts</span>
          <small>
            {settings.cardsPerPage} per page · {settings.cardSize}
          </small>
        </div>
        <article
          className={`memory-sheet font-${settings.fontStyle} size-${settings.cardSize} corners-${settings.cornerStyle} ${
            settings.cutLines ? "with-cut-lines" : ""
          }`}
          style={
            {
              "--memory-bg": settings.frontBackgroundColor,
              "--memory-border": settings.borderColor,
              "--memory-text": settings.textColor,
            } as React.CSSProperties
          }
        >
          <header className="memory-header">
            <div>
              <p className="eyebrow">Memory card game</p>
              <h2>{settings.title || "Untitled memory cards"}</h2>
              <p>{settings.instructions}</p>
            </div>
            <span>{pairCount} pair(s)</span>
          </header>
          <div className={`memory-card-grid cards-${settings.cardsPerPage}`}>
            {previewCards.map((card) => (
              <MemoryFaceCard
                card={card}
                key={card.id}
                showPairLabels={settings.showPairLabels}
              />
            ))}
          </div>
          {settings.cutLines ? (
            <p className="memory-cut-note">Dashed guides show where teachers cut the cards.</p>
          ) : null}
        </article>
      </section>

      <section className={`memory-page sheet-${settings.sheetSize} ${settings.orientation}`}>
        <div className="preview-side-label">
          <span>Card backs</span>
          <small>
            {settings.backPattern} · {settings.cornerStyle}
          </small>
        </div>
        <article
          className={`memory-sheet back-sheet size-${settings.cardSize} corners-${settings.cornerStyle} ${
            settings.cutLines ? "with-cut-lines" : ""
          }`}
          style={
            {
              "--memory-back": settings.backColor,
              "--memory-back-pattern": settings.backPatternColor,
              "--memory-border": settings.borderColor,
            } as React.CSSProperties
          }
        >
          <div className={`memory-card-grid cards-${settings.cardsPerPage}`}>
            {previewCards.map((card) => (
              <MemoryBackCard cardId={card.id} key={`back-${card.id}`} settings={settings} />
            ))}
          </div>
        </article>
      </section>

      {settings.showTeacherGuide ? (
        <MemoryTeacherGuide pairs={pairs} settings={settings} />
      ) : null}

      <div className="full-preview-note">
        <strong>{settings.title}</strong>
        <span>
          Preview updates from pair type, duplicate generation, shuffle, card design,
          page layout, backs, and teacher-guide settings.
        </span>
      </div>
    </div>
  );
}

function MemoryFaceCard({
  card,
  showPairLabels,
}: {
  card: MemoryCardPreviewItem;
  showPairLabels: boolean;
}) {
  const asset = card.kind === "image" ? getAsset(card.assetId) : undefined;

  return (
    <article className={`memory-card face-${card.kind}`}>
      <span className="memory-card-kicker">
        {showPairLabels ? `Pair ${card.pairLabel} - ${card.faceLabel}` : card.faceLabel}
      </span>
      {card.kind === "image" ? (
        asset ? (
          <div className="memory-card-image">
            <Image
              alt={asset.alt}
              fill
              sizes="(max-width: 900px) 38vw, 180px"
              src={asset.imageUrl}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="memory-image-placeholder">Image</div>
        )
      ) : (
        <strong>{card.content}</strong>
      )}
      {card.kind === "image" ? <strong>{card.content}</strong> : null}
      {card.subContent ? <small>{card.subContent}</small> : null}
    </article>
  );
}

function MemoryBackCard({
  cardId,
  settings,
}: {
  cardId: string;
  settings: MemorySettings;
}) {
  return (
    <article className={`memory-card memory-card-back pattern-${settings.backPattern}`}>
      <span className="memory-back-mark">MM</span>
      {settings.showBackLogo ? <small>School logo</small> : null}
      <span className="sr-only">Back for card {cardId}</span>
    </article>
  );
}

function MemoryTeacherGuide({
  pairs,
  settings,
}: {
  pairs: MemoryPair[];
  settings: MemorySettings;
}) {
  const faceKinds = getMemoryFaceKinds(settings.pairType);
  const guidePairs = pairs
    .filter((pair) => pair.word.trim() || pair.definition.trim() || pair.customLeft.trim())
    .slice(0, 12);

  return (
    <section className="memory-teacher-guide">
      <div className="preview-side-label">
        <span>Teacher answer key</span>
        <small>{settings.pairType}</small>
      </div>
      <div className="memory-guide-card">
        <h3>{settings.title || "Memory cards"} guide</h3>
        <ol>
          {guidePairs.map((pair, index) => {
            const left = getMemoryFaceContent(pair, faceKinds[0], 0);
            const right = getMemoryFaceContent(pair, faceKinds[1], 1);

            return (
              <li key={`memory-guide-${pair.id}`}>
                <strong>Pair {getMemoryPairLabel(index)}</strong>
                <span>{left.content}</span>
                <span>{right.content}</span>
              </li>
            );
          })}
        </ol>
        <p>
          {settings.duplicateMode === "double"
            ? "Duplicate pair generation is on: print two copies of every matching pair."
            : "Each row generates two cards: one left face and one right face."}
        </p>
      </div>
    </section>
  );
}

function FlashcardSheet({
  cardLayout,
  cardsPerSheet,
  fontStyle,
  items,
  mirrorForBack = false,
  orientation,
  settings,
  sheetLabel,
  sheetSize,
}: {
  cardLayout: CardLayout;
  cardsPerSheet: CardsPerSheet;
  fontStyle: FontStyle;
  items: EditableVocabularyItem[];
  mirrorForBack?: boolean;
  orientation: Orientation;
  settings: FlashcardSideSettings;
  sheetLabel: string;
  sheetSize: SheetSize;
}) {
  const sampleItem = items[0];
  const previewItems = sampleItem ? [sampleItem] : [];
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
        className={`flashcard-sheet cards-1 layout-${cardLayout} font-${fontStyle}`}
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
                    fill
                    sizes="(max-width: 900px) 50vw, 220px"
                    style={{ objectFit: "cover" }}
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
                {settings.content.translation ? (
                  <p className="translation">{item.translation || "Translation"}</p>
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
