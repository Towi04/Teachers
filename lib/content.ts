export type LicenseStatus =
  | "private"
  | "public-reusable"
  | "platform-approved"
  | "pending-review"
  | "restricted";

export type GradeBand = "Preschool" | "Elementary" | "Middle School";

export type VocabularyAsset = {
  id: string;
  word: string;
  title: string;
  imageUrl: string;
  alt: string;
  licenseStatus: LicenseStatus;
  attribution: string;
  suggestedForPublicUse: boolean;
};

export type VocabularyItem = {
  id: string;
  word: string;
  definition: string;
  example: string;
  assetId: string;
};

export type VocabularySet = {
  id: string;
  title: string;
  subject: string;
  language: string;
  gradeBand: GradeBand;
  visibility: "private" | "public";
  items: VocabularyItem[];
};

export type TemplateId = "playful" | "minimal" | "school";

export type FlashcardTemplate = {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
};

export type PlanTier = {
  id: "guest" | "free" | "premium" | "school";
  name: string;
  watermark: boolean;
  dailyDownloads: string;
  canUseSchoolLogo: boolean;
  publicDownloads: string;
};

export type ActivityId =
  | "flashcards"
  | "crossword"
  | "word-search"
  | "matching"
  | "bingo"
  | "memory"
  | "reading"
  | "quiz";

export type ActivityDefinition = {
  id: ActivityId;
  title: string;
  description: string;
  icon: string;
  status: "available" | "next" | "planned";
  inputType: string;
  outputType: string;
  accent: string;
  configurationHighlights: string[];
};

export const vocabularyAssets: VocabularyAsset[] = [
  {
    id: "run-park",
    word: "run",
    title: "Child running in a park",
    imageUrl:
      "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&w=900&q=80",
    alt: "A child running outdoors",
    licenseStatus: "public-reusable",
    attribution: "Reusable classroom image",
    suggestedForPublicUse: true,
  },
  {
    id: "read-book",
    word: "read",
    title: "Reading a book",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80",
    alt: "An open book on a desk",
    licenseStatus: "platform-approved",
    attribution: "Platform-approved demo asset",
    suggestedForPublicUse: true,
  },
  {
    id: "write-pencil",
    word: "write",
    title: "Writing with a pencil",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    alt: "A notebook and pencil",
    licenseStatus: "public-reusable",
    attribution: "Reusable classroom image",
    suggestedForPublicUse: true,
  },
  {
    id: "listen-headphones",
    word: "listen",
    title: "Listening with headphones",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
    alt: "A pair of headphones",
    licenseStatus: "pending-review",
    attribution: "Pending public review",
    suggestedForPublicUse: false,
  },
];

export const vocabularySets: VocabularySet[] = [
  {
    id: "classroom-actions",
    title: "Classroom Actions",
    subject: "Language Learning",
    language: "English",
    gradeBand: "Elementary",
    visibility: "private",
    items: [
      {
        id: "word-run",
        word: "run",
        definition: "To move quickly using your legs.",
        example: "I run in the playground.",
        assetId: "run-park",
      },
      {
        id: "word-read",
        word: "read",
        definition: "To look at words and understand them.",
        example: "We read a story in class.",
        assetId: "read-book",
      },
      {
        id: "word-write",
        word: "write",
        definition: "To make words with a pen or pencil.",
        example: "Please write your name.",
        assetId: "write-pencil",
      },
      {
        id: "word-listen",
        word: "listen",
        definition: "To pay attention to a sound.",
        example: "Listen to the teacher.",
        assetId: "listen-headphones",
      },
    ],
  },
];

export const flashcardTemplates: FlashcardTemplate[] = [
  {
    id: "playful",
    name: "Playful classroom",
    description: "Colorful rounded cards for preschool and elementary classes.",
    accent: "#ff7a59",
  },
  {
    id: "minimal",
    name: "Minimal ink saver",
    description: "Clean cards designed for low-ink printing.",
    accent: "#1f2937",
  },
  {
    id: "school",
    name: "School branded",
    description: "Premium-ready layout with room for a school logo.",
    accent: "#2563eb",
  },
];

export const planTiers: PlanTier[] = [
  {
    id: "guest",
    name: "Guest",
    watermark: true,
    dailyDownloads: "Limited public downloads",
    canUseSchoolLogo: false,
    publicDownloads: "Browse and try free resources",
  },
  {
    id: "free",
    name: "Free Teacher",
    watermark: true,
    dailyDownloads: "Credit-based downloads",
    canUseSchoolLogo: false,
    publicDownloads: "Earn credits from copyright-safe public resources",
  },
  {
    id: "premium",
    name: "Premium Teacher",
    watermark: false,
    dailyDownloads: "Unlimited personal downloads",
    canUseSchoolLogo: true,
    publicDownloads: "High or unlimited public resource downloads",
  },
  {
    id: "school",
    name: "School Plan",
    watermark: false,
    dailyDownloads: "Shared school library",
    canUseSchoolLogo: true,
    publicDownloads: "Institution-wide content access",
  },
];

export const activityDefinitions: ActivityDefinition[] = [
  {
    id: "flashcards",
    title: "Create flashcards",
    description:
      "Design printable cards with words, images, examples, and optional back sides.",
    icon: "FC",
    status: "available",
    inputType: "Vocabulary + images",
    outputType: "Printable cards",
    accent: "#f97316",
    configurationHighlights: [
      "Card size",
      "Frame color",
      "Images on/off",
      "Front only or double-sided",
    ],
  },
  {
    id: "crossword",
    title: "Create a crossword",
    description:
      "Turn vocabulary and clues into a classroom crossword worksheet.",
    icon: "CW",
    status: "available",
    inputType: "Words + clues",
    outputType: "Puzzle worksheet",
    accent: "#7c3aed",
    configurationHighlights: [
      "Grid difficulty",
      "Clue placement",
      "Answer key",
      "Large-print mode",
    ],
  },
  {
    id: "word-search",
    title: "Create a word search",
    description:
      "Generate a hidden-word activity from any vocabulary list.",
    icon: "WS",
    status: "next",
    inputType: "Vocabulary list",
    outputType: "Word puzzle",
    accent: "#0891b2",
    configurationHighlights: [
      "Grid size",
      "Word directions",
      "Picture hints",
      "Answer key",
    ],
  },
  {
    id: "matching",
    title: "Create matching cards",
    description:
      "Match words to images, definitions, translations, or examples.",
    icon: "MT",
    status: "planned",
    inputType: "Pairs",
    outputType: "Cut-out activity",
    accent: "#16a34a",
    configurationHighlights: [
      "Pair type",
      "Cut lines",
      "Image size",
      "Student answer sheet",
    ],
  },
  {
    id: "bingo",
    title: "Create bingo boards",
    description:
      "Build randomized bingo sheets from vocabulary or pictures.",
    icon: "BG",
    status: "planned",
    inputType: "Word bank",
    outputType: "Multiple boards",
    accent: "#db2777",
    configurationHighlights: [
      "Board size",
      "Number of boards",
      "Free space",
      "Image mode",
    ],
  },
  {
    id: "memory",
    title: "Create memory cards",
    description:
      "Prepare matching cards for vocabulary, pictures, and definitions.",
    icon: "MM",
    status: "planned",
    inputType: "Pairs",
    outputType: "Card game",
    accent: "#ca8a04",
    configurationHighlights: [
      "Pair layout",
      "Back design",
      "Card size",
      "Cut guides",
    ],
  },
  {
    id: "reading",
    title: "Create a reading worksheet",
    description:
      "Place a text and questions into a clean printable template.",
    icon: "RD",
    status: "planned",
    inputType: "Text + questions",
    outputType: "Worksheet",
    accent: "#2563eb",
    configurationHighlights: [
      "Reading layout",
      "Question style",
      "Answer space",
      "Teacher key",
    ],
  },
  {
    id: "quiz",
    title: "Create a printable quiz",
    description:
      "Format multiple-choice, true/false, or short-answer questions.",
    icon: "QZ",
    status: "planned",
    inputType: "Question bank",
    outputType: "Assessment",
    accent: "#475569",
    configurationHighlights: [
      "Question types",
      "Point values",
      "Answer key",
      "Randomization",
    ],
  },
];

export function getAsset(assetId: string) {
  return vocabularyAssets.find((asset) => asset.id === assetId);
}

export function canPublishSet(set: VocabularySet) {
  return set.items.every((item) => {
    const asset = getAsset(item.assetId);
    return asset?.suggestedForPublicUse === true;
  });
}

export function getReusableAssetsForWord(word: string) {
  return vocabularyAssets.filter(
    (asset) =>
      asset.word.toLowerCase() === word.toLowerCase() &&
      asset.suggestedForPublicUse,
  );
}
